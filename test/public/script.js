function add_image(tier) {
    console.log("안녕")
    $('#imageContainer').empty()
    if (tier=="브론즈") {
        // 조건이 true일 때 이미지 삽입
        var img = document.createElement("img");
        img.src = "/images/bronze.jpg";  // 이미지 경로 지정
        img.alt = "Description of image 1";    // 이미지 설명 (선택적)

        var container = document.getElementById("imageContainer");
        container.appendChild(img);
    } else if(tier=="실버"){
        // 조건이 false일 때 이미지 삽입
        var img = document.createElement("img");
        img.src = "/images/silver.jpg";  // 다른 이미지 경로 지정
        img.alt = "Description of image 2";    // 이미지 설명 (선택적)

        var container = document.getElementById("imageContainer");
        container.appendChild(img);
    }
    else if(tier=="골드"){
    // 조건이 false일 때 이미지 삽입
    var img = document.createElement('img');
    img.src = "/images/gold.jpg";  // 다른 이미지 경로 지정
    img.alt = "Description of image 2";    // 이미지 설명 (선택적)

    var container = document.getElementById("imageContainer");
    container.appendChild(img);
    }
    else if(tier=="플레티넘"){
    // 조건이 false일 때 이미지 삽입
    var img = document.createElement('img');
    img.src = "/images/platinum.jpg";  // 다른 이미지 경로 지정
    img.alt = "Description of image 2";    // 이미지 설명 (선택적)

    var container = document.getElementById("imageContainer");
    container.appendChild(img);
    }
    else if(tier=="에메랄드"){
        // 조건이 false일 때 이미지 삽입
        var img = document.createElement('img');
        img.src = "/images/e.jpg";  // 다른 이미지 경로 지정
        img.alt = "Description of image 2";    // 이미지 설명 (선택적)
    
        var container = document.getElementById("imageContainer");
        container.appendChild(img);
        }
    else if(tier=="다이아몬드"){
        // 조건이 false일 때 이미지 삽입
        var img = document.createElement("img");
        img.src = "/images/diamond.jpg";  // 다른 이미지 경로 지정
        img.alt = "Description of image 2";    // 이미지 설명 (선택적)
    
        var container = document.getElementById("imageContainer");
        container.appendChild(img);
    }
    else if(tier=="마스터"){
        // 조건이 false일 때 이미지 삽입
        var img = document.createElement("img");
        img.src = "/images/master.jpg";  // 다른 이미지 경로 지정
        img.alt = "Description of image 2";    // 이미지 설명 (선택적)
    
        var container = document.getElementById("imageContainer");
        container.appendChild(img);
    }
    else if(tier=="그랜드마스터"){
        // 조건이 false일 때 이미지 삽입
        var img = document.createElement("img");
        img.src = "/images/grandmaster.jpg";  // 다른 이미지 경로 지정
        img.alt = "Description of image 2";    // 이미지 설명 (선택적)
    
        var container = document.getElementById("imageContainer");
        container.appendChild(img);
    }
    else{
        // 조건이 false일 때 이미지 삽입
        var img = document.createElement("img");
        img.src = "/images/challenger.jpg";  // 다른 이미지 경로 지정
        img.alt = "Description of image 2";    // 이미지 설명 (선택적)
    
        var container = document.getElementById("imageContainer");
        container.appendChild(img);
    }
    
};
