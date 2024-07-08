// 서버측 채팅서버, 챗봇의 메인 코드
const User = require("../../models/user")
const Good = require("../../models/good")


exports.createChatServer = server => {
    const connectedUsers = new Map(); 
    const user_Score = new Map();
    const user_user = new Map();
    let currentIndex = -1;
    let state = true;
    // 모듈가져오기
    // http 서버를 넣어서 소켓통신이 가능한 객체를 획득(생성)
    const io = require("socket.io")( server, {
        cors: {
            origin: "https://example.com",
            methods: ["GET", "POST"]
        }
    })

    const initializeUser = (nickname) => {
        user_user[nickname] = {team1:'', team2:'', team3:'', team4:''};
    };


    // io로부터 이벤트를 등록
    io.on('connection', socket => {


        
        const addUserDetail = async(nickname,bid_name, sc_maxScore) => {

            try {
                if(user_user[nickname].team1 == ''){
                    user_user[nickname].team1 = bid_name
                }
                else if(user_user[nickname].team2 == ''){
                    user_user[nickname].team2 = bid_name
                }
                else if(user_user[nickname].team3 == ''){
                    user_user[nickname].team3 = bid_name
                }
                else if(user_user[nickname].team4 == ''){
                    user_user[nickname].team4 = bid_name
                }
                console.log(user_user[nickname])
                user_a(nickname, user_user[nickname], sc_maxScore);

            } catch(error) {
                console.log(`${nickname} not found.`);
            }
        };
        
        socket.on('team_name', (user_name)=>{
            const buser = user_user.get(user_name);
            user_a(user_name, buser);
        })
    
        // 남은 금액 화면 띄우기
        socket.on('remain_money', async (nickname, bid) => {
            const user_remainmoney = await User.findOne({
                where: { 
                    name : nickname
                }
            });
            if(''==bid){
                bid = 0;
            }
            if(state && user_remainmoney){
                console.log("낙찰금액: ", bid);
                user_remainmoney.money -= bid;
                await user_remainmoney.save();
                state = false;
            }
                // 변경된 정보를 모든 클라이언트에게 전송
            

            socket.emit('r_money');
            }
        )

        socket.on('login', (userId, nickname) => {
            // 사용자 정보 저장
            users[socket.id] = { userId, nickname };
            console.log(`${nickname}(${userId}) 님이 접속하였습니다.`);
          });

        // 팀장들 현재 점수랑 입찰가
        socket.on('now_point',async () => {
            
            
            const nicknames = Array.from(connectedUsers.values()).map(user => user.nickname)
            
            nicknames.forEach(async (nickname)=> {
                const now_point = await User.findOne({
                    where: {
                        name : nickname
                    }
                });
                let user_Scores = user_Score.get(nickname)
                if(now_point){
                if(user_Scores){
                    io.emit("now_p", now_point.money, user_Scores.score, nickname)
                }
                else
                    io.emit("now_p", now_point.money,'',nickname)
                }
              });
        })

        socket.on('cs_send_nname', ( nickname)=>{
            let score = 0
            user_Score.set(nickname, {
                nickname: nickname,
                score: score
            });
            initializeUser(nickname);
            if( "이태화" == nickname){
                return;
            }
            else{

                const existingUser = Array.from(connectedUsers.values()).find(user => user.nickname === nickname);
            
                if(!existingUser){
                    connectedUsers.set(socket.id, {
                    socketId: socket.id,
                    nickname: nickname
                    });
                }

                
            }
            io.emit('connectedUsers', Array.from(connectedUsers.values()).map(user => user.nickname));
          
        })

        socket.on('auctionscore', (nickname, score) => {
            // 받은 점수값을 이름과 같이 맵에 저장
            const existscore = Array.from(connectedUsers.values()).find(user => user.nickname === nickname);

            
            if(existscore){
                user_Score.delete(nickname);
                user_Score.set(nickname, {
                    nickname: nickname,
                    score: score
                  });
                  
            }
            else{
                user_Score.set(nickname, {
                    nickname: nickname,
                    score: score
                  });
            }


        })


        // 낙찰가 점수 비교
        socket.on('maxscore' , async(bid_name)=>{
            let maxScore = 0
            let sc_maxScore = 0;
            let maxNickname = null;
            let maxUser = 0

            user_Score.forEach((value, key) => {
                value.score = parseInt(value.score,10);
            if (value.score > maxScore) {
                maxScore = value.score;
                maxNickname = key;
            }
            console.log(key,value.score)
            })

            user_Score.forEach((value, key) => {
            if (maxScore == value.score) {
                maxUser++;
            }
            
            if( value.score > sc_maxScore && maxScore != value.score)
            {
                sc_maxScore = value.score;       
            }

            })


            console.log(maxUser, maxScore, currentIndex)
            console.log(maxUser, sc_maxScore, currentIndex)

            if(1< maxUser || 0 == maxScore){
                try{

                    const currentgoods = await Good.findAll({
                        attributes: ['name', 'nickname', 'tier', 'line', 'text']
                    });
                
                const newU = currentgoods[currentIndex]
                console.log("유찰", newU.toJSON())
                
                

                if(newU){
                    console.log("새로운 데이터 생성", )
                    const newUser = await Good.create({
                    name : newU.name,
                    nickname : newU.nickname,
                    tier : newU.tier,
                    line : newU.line,
                    text : newU.text
                    });
                    console.log("새로운 데이터 생성", newUser)
                }


                }catch(error){
                    console.log("이거 안돼")
                }
            }
            else if(1==maxUser){
                addUserDetail(maxNickname, bid_name, sc_maxScore);
                console.log("뽑은 사람 이름",maxNickname, "뽑힌사람 이름", bid_name)
                console.log('두개다 작동됨')
            }
        });

        function user_a(maxNickname, user, sc_maxScore=0) {
            io.emit('bidgoods',maxNickname, user, sc_maxScore);
        }
        
        socket.on('disconnect', () => {
            connectedUsers.delete(socket.id)
            console.log('Client disconnected');
          });
        
        socket.on('goods', async()=>{
            for (let [key, value] of user_Score) {
                value.score = 0;
            }

            io.emit("now_point_zero")

            try {
                user_Score.clear();        
                const goods = await Good.findAll({
                    attributes: ['name', 'nickname', 'tier', 'line', 'text']
                });
                    currentIndex++;
                    io.emit('next_gp',  goods , currentIndex+1)
                    if(goods[currentIndex])
                    {
                        io.emit('seegoods', goods[currentIndex])
                    }
                    else
                    {
                        io.emit('seegoods', '')
                    }
                    state = true;
                        
                    }catch (error) {
                        error;
                    }
                    },
                )
                
    
    })
    
}