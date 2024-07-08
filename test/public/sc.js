      let nickname = ''
      let gMyRoom = ''
      var name_Data = ''


      // 실질적 소켓 통신이 수행됨 -> CDN
      // 1. 서버 접속
      // 만약 websocket이면 ws://
      
      
      const socket = io.connect('http://localhost:3000')
      console.log('클라이언트가 접속 OK,소켓획득')
      // 2. 클라이언트 준비 : 접속시 수행할 내용 작성
      socket.on('connect', () => {
        // 익명닉네임을 서버로 전송(emit)
        spanname = document.getElementById('user-name');
        nickname = spanname.textContent;
        socket.emit('cs_send_nname', nickname)
        socket.emit('remain_money',nickname,'')
        socket.emit('now_point')
        socket.emit('team_name', nickname)
        
      })


      // 남은 금액 띄우기
      socket.on('r_money', r_money =>{
        console.log('서버로부터 r_money 이벤트를 수신했습니다:', r_money);

        const moneyValueElement = document.getElementById('moneyValue');
        if (moneyValueElement) {
            moneyValueElement.textContent = r_money;
        } else {
            console.error('moneyValue 요소를 찾을 수 없습니다.');
        }
      } )


      // 서버에서 받은 닉네임 배열 처리하고 메인 화면에 띄우기
      socket.on('connectedUsers', (nicknames) => {
        console.log('연결된 사용자들의 닉네임:', nicknames);
        // 예시: 화면에 닉네임들 출력
        $('#main_T').empty()
        let html = ''
        nicknames.forEach(nickname => {
          html += `<div class="team" id="box1">
                    <div class="team_leaders" id = ${nickname}>
                    <div class="team_leader" style="color:#3F48CC"> ${nickname}</div>
                    </div>
                    <div class="team_point">
                      보유 자산: <span id = ${nickname}point></span>원
                    </div>
                    <div class="team_bid">
                      입찰가: <span id = ${nickname}bid></span> 점
                    </div>
                  </div>
                `
        });
        $('#main_T').append(html)
        socket.emit("now_point", nickname)
      
      });

      socket.on("now_p", (point, bid, nickname) => {
        if(''==bid){
          bid = 0
        }
        console.log("포인트", point, bid)
            $(`#${nickname}point`).text(point)
            $(`#${nickname}bid`).text(bid)
            
        });
      
      // 상품 띄우기
      $('#next_btn').click(function() {
        
        socket.emit("now_point", nickname)
        socket.emit('goods')
        
      })

      socket.on("now_point_zero", () => {
        $('#now_price').text(0);
      })

      socket.on('seegoods', (data)=>{
        if(data){
         name_Data =  $('#nameSpan').text(data.name);
          $('#nicknameSpan').text(data.nickname);
          $('#tierSpan').text(data.tier);
          $('#lineSpan').text(data.line);
          $('#textSpan').text(data.text);
          localStorage.setItem('name',data.name);
          localStorage.setItem('nickname',data.nickname);
          localStorage.setItem('tier',data.tier);
          localStorage.setItem('line',data.line);
          localStorage.setItem('text',data.text);
          console.log(data.tier);
          add_image(data.tier);
        }
        else{
          name_Data =  $('#nameSpan').text();
          $('#nicknameSpan').text();
          $('#tierSpan').text();
          $('#lineSpan').text();
          $('#textSpan').text("끝");

        }
        
      })
      
      
      // 경매 점수 등록시 경매 점수에 등록
      $('#score_submit').click(function() {
        const Score = document.getElementById('auction_score').value;
        if (isNaN(Score)) Score = 0;
        $('#now_price').text(Score);
        socket.emit('auctionscore', nickname, Score); // 서버로 데이터 전송
        $('#auction_score').empty()
      });



      // 점수 모두 제출
      $('#end_auction').click(function() {
        const name = $('#nameSpan').text();
        socket.emit('maxscore', name); // 서버로 데이터 전송
        socket.emit("now_point")

      });
      
      
      // 경매 낙찰된 사람 받아오기
      socket.on('bidgoods' ,(nickname, user, sc_maxScore)=>{
        console.log("두번쨰로 큰 값", sc_maxScore)
        console.log(user)
        let html = '';
        if(user){
          const name1 = user.team1 || ' ';
          const name2 = user.team2 || '';
          const name3 = user.team3 || '';
          const name4 = user.team4 || '';

        // 2. html 으로 집어넣기 

          html = `<div class="team_leader" style="color:#3F48CC"> ${nickname}</div>
                  <div class = "team_leader" id = ${user.team1}></div>
                  <div class = "team_leader" id = ${user.team2}></div>
                  <div class = "team_leader" id = ${user.team3}></div>
                  <div class = "team_leader" id = ${user.team4}></div>`
          
          $(`#${nickname}`).empty()
          $(`#${nickname}`).append(html);
          if(name1)$(`#${user.team1}`).text(name1);
          if(name2)$(`#${user.team2}`).text(name2);
          if(name3)$(`#${user.team3}`).text(name3);
          if(name4)$(`#${user.team4}`).text(name4);

          socket.emit('remain_money',nickname,sc_maxScore)
        }
      });

      
      
      
      
      
      // 로그아웃 시
      socket.on('disconnect', () => {
        console.log(`클라이언트 연결이 해제되었습니다. Socket ID: ${socket.id}`);
    
        // 예시: 맵에서 해당 소켓 정보 삭제
    
        // 연결 종료 후 처리
        // ...
      });

      // 3. 서버가 보낸 메세지를 클라이언트 채팅창에 세팅
      socket.on('sc_send_msg', (sender, msg, date) => {
        console.log(sender, msg, date)
        // 서버로 부터 전송받은 메세지를 화면에 표시 -> DOM조작, UI조작
        addMessage(sender, msg, date, sender == nickname ? true : false)
      })

     


      