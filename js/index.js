/*
 * @Author : Zhang Mengke
 * @Email  : mencre@163.com
 * @Date   : 2019/09/08
 */
//音效
var bgMusic = document.createElement("audio");
bgMusic.src = "audio/bgm.wav";
bgMusic.loop = "loop";
bgMusic.play();
var boomMusic = document.createElement("audio");

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var heroImg = document.getElementById("heroImg");
var bulletImg = document.getElementById("bulletImg");
var boss1Img = document.getElementById("boss1");
var bullets = []; //子弹数组
var enemyList = []; //创建敌机数组
//创建敌机爆炸动画数组
var enemyDeathImg = [
	document.getElementById("enemy1_down1"),
	document.getElementById("enemy1_down2"),
	document.getElementById("enemy1_down3"),
	document.getElementById("enemy1_down4"),
	document.getElementById("enemy1_down5")
];
//创建英雄机爆炸动画数组
var heroDeathImg = [
	document.getElementById("hero_down1"),
	document.getElementById("hero_down2"),
	document.getElementById("hero_down3"),
	document.getElementById("hero_down4"),
];
//创建boss机爆炸动画数组
var bossDeathImg = [
	document.getElementById("boss1_down1"),
	document.getElementById("boss1_down2"),
	document.getElementById("boss1_down3"),
	document.getElementById("boss1_down4"),
	document.getElementById("boss1_down5"),
];

//对象 type 1: 英雄机, 2: 敌机, 3: boss
//英雄机对象
var hero = {
	width: 99,
	height: 124,
	x: 200,
	y: 600,
	hp: 3,
	score: 0,
	type: 1
}
//boss对象
var boss = {
	status: 0, //是否出现,0"未出现，1:出现
	width: 169,
	height: 258,
	x: randomNum(0, 400),
	y: -258,
	speed: 4.5,
	type: 3,
	hp: 10 //血量,初始为10
}

var fireFlag = false;
var upFlag = false;
var downFlag = false;
var leftFlag = false;
var rightFlag = false;
var fireMusic = document.createElement("audio");
//定时器
var moveInterval = null;
var bossInterval = null;



//展示最高分
function init () {
	if (getCookie("score") != null && getCookie("time") != null) {
		var showMaxScore = "<p>最高分：" + getCookie("score") +"</p><p>创造时间：" + getCookie("time") +  "</p>"
		document.getElementById("showMaxScore").innerHTML = showMaxScore;
	}
}

//子弹
function fire() {
	var x = hero.x + (hero.width / 2) - 9 / 2;
	var y = hero.y - 10;
	var bullet = {
		width: 9,
		height: 21,
		x: x,
		y: y
	}
	bullets.push(bullet);
	fireMusic.src = "audio/fire2.mp3";
	fireMusic.play(); //子弹音效
}
//开始按钮按下
function start() {
	//document.getElementById("title").style.cssText = "display: none;";
	//document.getElementById("start").style.cssText = "display: none;";
	document.getElementById("showMaxScore").style.cssText = "display: none;";
	document.getElementById("titleImg").style.cssText = "display: none;";
	document.getElementById("startDiv").style.cssText = "display: none;";
	document.getElementById("autoFire").style.cssText = "display: none;";
	document.getElementById("autoFireDiv").style.cssText = "display: none;";
	document.getElementById("showLife").innerText = "生命:3";
	document.getElementById("showScore").innerText = "分数:0";
	document.getElementById("showLevel").innerText = "第 1 关";

	context.drawImage(heroImg, hero.x, hero.y);

	//开始后自动发射子弹
	if (document.getElementById("autoFire").checked) {
		setInterval(function() {
			fire();
		}, 100);
	}

	//键盘按下
	window.addEventListener("keydown", function(e) {
		if (e.keyCode == 74 || e.keyCode == 32) { //j
			//fireFlag = true;	//可连发
			fire(); //不可连发
		} else if (e.keyCode == 87 || e.keyCode == 38) { //w 上
			upFlag = true;
		} else if (e.keyCode == 83 || e.keyCode == 40) { //s 下
			downFlag = true;
		} else if (e.keyCode == 65 || e.keyCode == 37) { //a 左
			leftFlag = true;
		} else if (e.keyCode == 68 || e.keyCode == 39) { //d 右
			rightFlag = true;
		}
	})

	//键盘松开
	window.addEventListener("keyup", function(e) {
		if (e.keyCode == 74 || e.keyCode == 32) {
			fireFlag = false;
		} else if (e.keyCode == 87 || e.keyCode == 38) { //w 上
			upFlag = false;
		} else if (e.keyCode == 83 || e.keyCode == 40) { //s 下
			downFlag = false;
		} else if (e.keyCode == 65 || e.keyCode == 37) { //a 左
			leftFlag = false;
		} else if (e.keyCode == 68 || e.keyCode == 39) { //d 右
			rightFlag = false;
		}
	})

	//移动定时器
	moveInterval = setInterval(function() {

		//英雄机移动
		if (upFlag) { //上
			context.clearRect(hero.x, hero.y, hero.width, hero.height);
			if (hero.y > -heroImg.height / 2) {
				hero.y -= 3;
				// hero.x = hero.x -3;
			}
			context.drawImage(heroImg, hero.x, hero.y);
		}
		if (downFlag) { //下
			context.clearRect(hero.x, hero.y, hero.width, hero.height);
			if (hero.y < canvas.height - heroImg.height / 2) {
				hero.y += 5;
			}
			context.drawImage(heroImg, hero.x, hero.y);
		}
		if (leftFlag) { //左
			context.clearRect(hero.x, hero.y, heroImg.width, heroImg.height);
			if (hero.x > -heroImg.width / 2) {
				hero.x -= 3;
				// hero.x = hero.x -3;
			}
			context.drawImage(heroImg, hero.x, hero.y);
		}
		if (rightFlag) { //右
			context.clearRect(hero.x, hero.y, heroImg.width, heroImg.height);
			if (hero.x < canvas.width - heroImg.width / 2) {
				hero.x += 3;
			}
			context.drawImage(heroImg, hero.x, hero.y);
		}

		//绘制子弹
		for (var i = 0; i < bullets.length; i++) {
			var b = bullets[i];
			context.clearRect(b.x, b.y, b.width, b.height);
			b.y = b.y - 5;
			if (b.y < 0) {
				bullets.splice(i, 1);
				i--;
				continue;
			} else {
				context.drawImage(bulletImg, b.x, b.y);
				///////////////////////////////////
				hit(b, i); //碰撞(子弹,index)

			}
		}

		//绘制敌机
		for (var i = 0; i < enemyList.length; i++) {
			var enemyItem = enemyList[i];
			context.clearRect(enemyItem.x, enemyItem.y, enemyImg.width, enemyImg.height);
			enemyItem.x += enemyItem.speedX;
			enemyItem.y += enemyItem.speedY;
			//敌机飞出画布
			if (enemyItem.y > canvas.height) {
				enemyList.splice(i, 1); //根据i下标,删除一个敌机
				i--;
			} else {
				//绘制敌机
				context.drawImage(enemyImg, enemyItem.x, enemyItem.y);
				collideEnemy(enemyItem,i);
			}
		}

		//关卡设置
		switch (hero.score) {
			case 10:
				if(boss.status == 0){
					boss.hp = 10;
					boss.status = 1;
					creatBoss();
				}
				document.getElementById("main").style.cssText = "background-image: url(img/bg_02.jpg);";
				document.getElementById("showLevel").innerText = "第 2 关";
				break;
			case 20:
				document.getElementById("main").style.cssText = "background-image: url(img/bg_03.jpg);";
				document.getElementById("showLevel").innerText = "第 3 关";
				break;
			case 30:
				document.getElementById("main").style.cssText = "background-image: url(img/bg_04.jpg);";
				document.getElementById("showLevel").innerText = "第 4 关";
				break;
			case 40:
				if(boss.status == 0){
					//重置boss对象
					boss = {
						status: 1,
						width: 169,
						height: 258,
						x: randomNum(0, 400),
						y: -258,
						speed: 4.5,
						type: 3,
						hp: 20
					}
					creatBoss();
				}
				document.getElementById("main").style.cssText =
					"background-image: url(img/bg_05.jpg); background-size: 512px 768px;";
				document.getElementById("showLevel").innerText = "第 5 关";
				break;
			default:
				break;
		}
	}, 10)

	createEnemy();
	
	if (boss.status == 1) {
		console.log("create boss");
		creatBoss(boss.status);
	}

}




//重新开始
function restart() {
	context.clearRect(0, 0, 512, 768);
	//重置英雄机
	hero = {
		width: 99,
		height: 124,
		x: 200,
		y: 600,
		hp: 3,
		score: 0
	}
	boss = {
		status: 0, //是否出现,0"未出现，1:出现
		width: 169,
		height: 258,
		x: randomNum(0, 400),
		y: -258,
		speed: 4.5,
		type: 3,
		hp: 10 //血量,初始为10
	}
	enemyList = [];
	bullets = [];
	document.getElementById("iconRestart").style.cssText = "display: none;";
	start();
}

//创建敌机
function createEnemy() {
	setInterval(function() {
		for (var i = 0; i < 1; i++) {
			var enemys = new Object();
			enemys.type = 2;
			enemys.x = Math.random() * (canvas.width - enemyImg.width);
			enemys.y = -enemyImg.height;
			enemys.speedX = randomNum(-0.2, 0.2);
			enemys.speedY = randomNum(1, 2.5);
			enemys.width = enemyImg.width;
			enemys.height = enemyImg.height;
			enemyList.push(enemys);
		}
	}, 1000);
}

//boss
function creatBoss(status) {
	document.getElementById("showBossHP").style.cssText = "display: block;";
	document.getElementById("showBossHP").innerText = "BOOS血量：" + boss.hp;
	context.drawImage(boss1Img, boss.x, boss.y);
	bossInterval = setInterval(function() {
		context.clearRect(boss.x, boss.y, boss.width, boss.height);
		boss.y += boss.speed;
		context.drawImage(boss1Img, boss.x, boss.y);
		
		//撞击到boss
		if ((hero.x + heroImg.width > boss.x && hero.x < boss.x + boss1Img.width) &&
			(hero.y + heroImg.width > boss.y && hero.y < boss.y + boss1Img.height)) {
			console.log("撞击boos");
			//hero.hp = 0;
			boom(hero);
			clearInterval(moveInterval);
			clearInterval(bossInterval);
			gameOver();
		}
	}, 100)
}

//撞击到敌机
function collideEnemy (element,i) {
	//检测敌机和英雄级是否相撞
	if ((hero.x + heroImg.width > element.x && hero.x < element.x + enemyImg.width) &&
		(hero.y + heroImg.width > element.y && hero.y < element.y + enemyImg.height)) {
		context.clearRect(element.x, element.y, enemyImg.width, enemyImg.height);
		
		enemyList.splice(i, 1);
		boom(element); 
		hero.hp--;
		document.getElementById("showLife").innerText = "生命:" + hero.hp;
		if (hero.hp <= 0) {
			boom(hero);
			clearInterval(moveInterval);
			gameOver();
		}
	}
}


//子弹撞到敌机
function hit(b, i) {
	//检测子弹是否撞击敌机
	for (var m = 0; m < enemyList.length; m++) {
		var enemyItem = enemyList[m];
		if ((b.x + bulletImg.width > enemyItem.x && b.x < enemyItem.x + enemyImg.width) &&
			(b.y < enemyItem.y + enemyImg.height && b.y + bulletImg.height > enemyItem.y)) {
			//加分
			hero.score++;
			document.getElementById("showScore").innerText = "分数:" + hero.score;
			//删除子弹
			context.clearRect(b.x, b.y, bulletImg.width, bulletImg.height);
			bullets.splice(i, 1);
			i--;
			//删除敌机
			enemyList.splice(m, 1);
			//敌机爆炸
			boom(enemyItem);
		}
	}
	//检测子弹是否撞击boss
	if (boss.status == 1) {
		if ((b.x + bulletImg.width > boss.x && b.x < boss.x + boss1Img.width) &&
			(b.y < boss.y + boss1Img.height && b.y + bulletImg.height > boss.y)) {
			//加分
			hero.score++;
			document.getElementById("showScore").innerText = "分数:" + hero.score;
			//删除子弹
			context.clearRect(b.x, b.y, bulletImg.width, bulletImg.height);
			bullets.splice(i, 1);
			i--;
			//血量-1
			boss.hp -= 1;
			document.getElementById("showBossHP").innerText = "BOOS血量：" + boss.hp;
			//boss爆炸
			if (boss.hp <= 0) {
				boss.status = 0; //标志设置为 0: 未出现
				clearInterval(bossInterval);
				boom(boss);
			}
		}
	}
}


//飞机爆炸
function boom(element) {
	element.speed = 0;
	//爆炸声音
	boomMusic.src = "audio/boom.mp3";
	boomMusic.play();
	//敌机爆炸动画
	var deathIndex = 0;
	//敌机爆炸
	var boomInterval = setInterval(function() {
		context.clearRect(element.x, element.y, element.width, element.height);
		if ((element.type == 1 && deathIndex >= 4) || deathIndex >= 5) {
			//停止计时器
			clearInterval(boomInterval);
			return;
		}
		if (element.type == 1) { 		//如果是英雄机
			context.drawImage(heroDeathImg[deathIndex], element.x, element.y);
		} else if (element.type == 2) { //如果是敌机
			context.drawImage(enemyDeathImg[deathIndex], element.x, element.y);
		} else if (element.type == 3) { //如果是boss
			context.drawImage(bossDeathImg[deathIndex], element.x, element.y);
			document.getElementById("showBossHP").style.cssText = "display: none;"
		}
		deathIndex++;
	}, 150)
	context.clearRect(element.x, element.y, element.width, element.height);
}


//游戏结束，保存成绩
function gameOver () {
	console.log(getCookie("score"));
	console.log(getCookie("time"));
	if (getCookie("score") == null || hero.score > getCookie("score")){
		setCookie("score", hero.score);
		setCookie("time", getTime());
	}
	document.getElementById("iconRestart").style.cssText = "display: block;";
}


//产生随机数
function randomNum(minNum, maxNum) {
	return Math.random() * (maxNum - minNum) + minNum;
}
