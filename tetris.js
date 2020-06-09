//Переменные для машинного обучения
const totalPopulation = 150; //Число игр сыгранных в каждом поколении
const numPredicts = 5; //Число предсказаний для манипуляции с фигурой за кадр
const mutationRate = 0.5; //Вероятность того, что некторые веса будут изменены
const differentGames = true; //Игра с разными условиями от поколения к поколению
let progressiveGenerations = true; //Ограничение количества фигур для освоения ранних этапов


//Страница
let logo;
let canvas;
let canvasHeight = 480;
let canvasWidth = 350;
let gameWidth = 240;
let gameHeight = 480;


//Игра
let I = [];
let O = [];
let T = [];
let S = [];
let Z = [];
let J = [];
let L = [];
let shapes = [];
let score;
let landedMap;
let speedUp;
let defeat;
let speed;
let nextShape;
let nextShapes = [];


//Audio Variables
let theme_song;
let hit;
let drop_hit;
let rotate;
let remove_line;


//Auxiliary Variables
let lastIndex;
let playOnce;
let gamesPlayed = 0;


//Статистика при машинном обучении
let ML;
let maxNumShapes = 6; //Начальное количество фигур, если включено ограничение
let maxLinesRemoved = 0; //Максимальное количество очищенных рядов в каждой игре
let linesRemoved = 0;
let averageLevel = 0;
let averageHeightDiffs = 0; //Средняя разница в высоте между колоннами
let totalHeightDiffs = 0;
let averageNumHoles = 0; //Среднее количество дыр в каждой игре
let totalNumHoles = 0;
let averageNumShapesAdded = 0; //Среднее количество добавленных фигур
let averageDensity = 0; //Средняя плотность
let totalDensity = 0;
let averageScore = 0; //Средний счет
let totalScore = 0;
let maxScore = 0; //Максимальный счет
let maxFitness = 0; //Максимальная приспособленность поколения
let generation = 1;
let allGames = [];
let activeGames = [];


//Загрузка фигур
function preload()
{
	I.push(loadImage('resources/I1.png'));
	I.push(loadImage('resources/I2.png'));

	O.push(loadImage('resources/O1.png'));

	T.push(loadImage('resources/T1.png'));
	T.push(loadImage('resources/T2.png'));
	T.push(loadImage('resources/T3.png'));
	T.push(loadImage('resources/T4.png'));

	S.push(loadImage('resources/S1.png'));
	S.push(loadImage('resources/S2.png'));

	Z.push(loadImage('resources/Z1.png'));
	Z.push(loadImage('resources/Z2.png'));

	J.push(loadImage('resources/J1.png'));
	J.push(loadImage('resources/J2.png'));
	J.push(loadImage('resources/J3.png'));
	J.push(loadImage('resources/J4.png'));

	L.push(loadImage('resources/L1.png'));
	L.push(loadImage('resources/L2.png'));
	L.push(loadImage('resources/L3.png'));
	L.push(loadImage('resources/L4.png'));

	logo = loadImage('resources/tetris.png');


	background(0);
	strokeWeight(3);
	stroke(0);
	fill(60, 60, 60);
	rect(240, -1, 110, 481);
	image(logo, 252, 410);
	fill(0, 0, 0);
	rect(250, 10, 90, 116);
	image(nextShape[0], 240 + (110 - nextShape[0].width) / 2, 10 + (116 - nextShape[0].height) / 2);
}

function setup()
{
	frameRate(2);
	background(0);
	canvas = createCanvas(canvasWidth, canvasHeight);
	canvas.parent('canvascontainer');
	centerSketch();

	landedMap = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
	defeat = false;
	playOnce = true;
	score = 0;
	lastIndex = shapes.length - 1;
	speedUp = false;
	speed = 240;
	ML = 1;
	resetGenStats();

	pickShape();
}

function tryMoveLeft()
{
	if(shapes[lastIndex].x >= 24 && !checkHorizontalCollisions(1))
	{
		shapes[lastIndex].x -= 24;
		for(var i = 0; i < shapes[lastIndex].positions.length; i++)
			shapes[lastIndex].positions[i][0] -= 1;
		whoosh.play();
	}
}

function tryMoveRight()
{
	if(shapes[lastIndex].x < gameWidth - shapes[lastIndex].width && !checkHorizontalCollisions(0))
	{
		shapes[lastIndex].x += 24;
		for(var i = 0; i < shapes[lastIndex].positions.length; i++)
			shapes[lastIndex].positions[i][0] += 1;
		whoosh.play();
	}
}

function tryRotate()
{
	if(!checkRotationCollisions())
	{
		shapes[lastIndex].rotate();
		rotate.play();
	}
}

function drop()
{
	frameRate(60);
	speedUp = true;
	while(!shapes[lastIndex].locked)
		shapesDescend(speedUp);
	speedUp = false;
	drop_hit.play();
	score += 40;
}


function restart()
{
	landedMap = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

	shapes = [];
	defeat = false;
	playOnce = true;
	gameover.stop();
	if(!theme_song.isPlaying())
		theme_song.play();
	score = 0;

	x = 0;
	y = 0;
	lastIndex = shapes.length - 1;
	speedUp = true;

	pickShape();
	addShape();
}

//Обновление статистики
function updateStats()
{
	//Обновление приспособоленности для каждой игры
	normalizeFitness();
	resetGenStats();

	for(var i = 0; i < allGames.length; i++)
	{
		linesRemoved += allGames[i].linesRemoved;
		averageNumShapesAdded += allGames[i].numShapesAdded;
		averageLevel += allGames[i].level;
		if(allGames[i].score > maxScore)
			maxScore = allGames[i].score;
		if(allGames[i].linesRemoved > maxLinesRemoved)
			maxLinesRemoved = allGames[i].linesRemoved;

		if(activeGames.length == 0) //Update only if there are no active games
		{
			totalDensity += allGames[i].density;
			totalScore += allGames[i].score;
			totalHeightDiffs += allGames[i].heightDifferences_sum;
			totalNumHoles += allGames[i].holes;


			if(allGames[i].fitness > maxFitness)
				maxFitness = allGames[i].fitness;
		}
	}
	averageNumShapesAdded = averageNumShapesAdded / allGames.length;
	averageLevel = averageLevel / allGames.length;

	if(activeGames.length == 0) //Update only if there are no active games
	{
		averageDensity = totalDensity / gamesPlayed;
		averageScore = totalScore / gamesPlayed;
		averageHeightDiffs = totalHeightDiffs / gamesPlayed;
		averageNumHoles = totalNumHoles / gamesPlayed;
	}
}


//Сбрасывает  статистику поколения для новой игры
function resetGenStats()
{
	averageLinesRemoved = 0;
	averageLevel = 0;
	averageNumShapesAdded = 0;
	maxFitness = 0;
}

//Добавляет фигуру
function addShape(shape)
{
	if(shape)
	{
		shapes.push(new Tetrominu(shape));
	}
	//pickShape();
	lastIndex = shapes.length - 1;
}

//Добавляет фигуру в игру
function pickShape()
{
	let rand = Math.floor(random(7));
	switch(rand)
	{
		case 0:	nextShape = I; break;
		case 1:	nextShape = O; break;
		case 2:	nextShape = T; break;
		case 3:	nextShape = S; break;
		case 4:	nextShape = Z; break;
		case 5:	nextShape = J; break;
		case 6:	nextShape = L; break;
	}
}

//Скорость
function updateSpeed()
{
	let newFrameRate = map(speed, 24, 120, 2, 20);
	frameRate(newFrameRate);
}


function shapesDescend(checkSpeed)
{
	if(!checkSpeed)
		updateSpeed();

	// Чтобы не выходило за пределы экрана
	if(shapes[lastIndex].y >= height - shapes[lastIndex].height)
	{
		shapes[lastIndex].locked = true;
	}

	if(shapes[lastIndex].y + shapes[lastIndex].speed >= height - shapes[lastIndex].height)
	{
		shapes[lastIndex].speed = 24;
	}

	if(!shapes[lastIndex].locked)
	{
		if(!checkCollisions(shapes[lastIndex]))
			shapes[lastIndex].descend();
	}

	//Отметка что клетка занята
	if(shapes[lastIndex].locked)
	{
		if(shapes[lastIndex].y >= 0)
		{
			for(var i = 0; i < shapes[lastIndex].positions.length; i++)
			{
				var x = shapes[lastIndex].positions[i][0];
				var y = shapes[lastIndex].positions[i][1];
				landedMap[y][x] = 1;
			}
		}

		//Проверка заполнен ряд
		removeLine();
	}
}

function checkCollisions(shape)
{
	for(var i = 0; i < shapes[lastIndex].positions.length; i++)
	{
		var x = shape.positions[i][0];
		var y = shape.positions[i][1];
		if(x >= 0 && y >= 0 && y + 1 <= 19)
			if(landedMap[y + 1][x] != 0)
			{
				shape.locked = true;
				return true;
			}
	}
	return false;
}


function checkHorizontalCollisions(side)
{
	let temp = JSON.parse(JSON.stringify(shapes[lastIndex].positions));
	for(var i = 0; i < temp.length; i++)
	{
		if(side == 1)
			temp[i][0]--;
		else if(side == 0)
			temp[i][0]++;
	}

	for(var i = 0; i < temp.length; i++)
	{
		var x = temp[i][0];
		var y = temp[i][1];
		if(x >= 0 && y >= 0 && y<= 19)
		{
			if(landedMap[y][x] != 0)
			{
				return true;
			}
		}
	}
	return false;
}

function checkRotationCollisions()
{
	let state = shapes[lastIndex].state;
	shapes[lastIndex].rotate();
	let temp = JSON.parse(JSON.stringify(shapes[lastIndex].positions));

	while(shapes[lastIndex].state != state)
		shapes[lastIndex].rotate();

	for(var i = 0; i < temp.length; i++)
	{
		var x = temp[i][0];
		var y = temp[i][1];
		if(x >= 0 && y >= 0 && y<= 19)
		{
			if(landedMap[y][x] != 0)
			{
				return true;
			}
		}
	}
	return false;
}

//Удаление ряда
function removeLine()
{
	let full = true;
	let lines = [];

	//Ищет какие удалить
	for(var i = 0; i < 20; i++)
	{
		for(var j = 0; j < 10; j++)
		{
			if(landedMap[i][j] != 1)
			{
				full = false;
			}
		}
		if(full)
			lines.push(i);
		full = true;
	}

	for(var i = 0; i < lines.length; i++)
	{
		for(var j = 0; j < shapes.length; j++)
		{
			for(var k = shapes[j].positions.length - 1; k >= 0; k--)
			{
				if(shapes[j].positions[k][1] == lines[i])
				{
					landedMap[lines[i]][shapes[j].positions[k][0]] = 0;
					shapes[j].positions.splice(k, 1);
				}
			}
		}
	}

	for(var i = 0; i < lines.length; i++)
	{
		for(var l = lines[i] - 1; l >= 0; l--)
		{
			for(var j = 0; j < shapes.length; j++)
			{
				for(var k = 0; k < shapes[j].positions.length; k++)
				{
					if(shapes[j].positions[k][1] == l)
					{
						landedMap[l][shapes[j].positions[k][0]] = 0;
						shapes[j].positions[k][1]++;
						landedMap[l + 1][shapes[j].positions[k][0]] = 1;
					}
				}
			}
		}
	}

	score = score + (pow(lines.length, 4) * 100);
}

//Центрирование
function centerSketch()
{
	let x = 142;
	let y = 53;

	if(windowWidth / 2 - canvasWidth / 2 >= 142)
		x = windowWidth / 2 - canvasWidth / 2;

	canvas.position(x, y);
}

function windowResized()
{
	centerSketch();
}

function addCurShapeMap(i)
{
	//Видимость частей фигуоы за пределами экрана
	let auxmap1 = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

	let auxmap2 = JSON.parse(JSON.stringify(activeGames[i].landedMap));

	for(var k = 0; k < activeGames[i].shapes[activeGames[i].shapes.length - 1].positions.length; k++)
	{
		if(activeGames[i].shapes[activeGames[i].shapes.length - 1].positions[k][1] < 0)
		{
			let x = activeGames[i].shapes[activeGames[i].shapes.length - 1].positions[k][0];
			let y = map(activeGames[i].shapes[activeGames[i].shapes.length - 1].positions[k][1], -4, -1, 0, 3);
			if(x <= 9 && y <= 19)
				auxmap1[y][x] = 1;
		}
		else if(activeGames[i].shapes[activeGames[i].shapes.length - 1].positions[k][1] >= 0)
		{
			let x = activeGames[i].shapes[activeGames[i].shapes.length - 1].positions[k][0];
			let y = activeGames[i].shapes[activeGames[i].shapes.length - 1].positions[k][1];
			if(x <= 9 && y <= 19)
				auxmap2[y][x] = 1;
		}
	}
	return auxmap1.concat(auxmap2);
}

//Отрисовка
function draw()
{
		//Кадры
		frameRate(2);

		background(0);

		fill(60, 60, 60);

		rect(240, -1, 110, 481);

		//Если нет активных игры, переход к следующему поколению
		if(activeGames.length == 0 && allGames.length != 0)
		{
			//Создание нового поколения
			let newMlPlayers = generate(allGames);

			//Сброс свойств поколения
			resetGenStats();

			//Увеличение числа поколения
			generation++;

			//Если включен режим адаптации поколения то добавляет фигуру в каждую игру
			if(progressiveGenerations &&  generation <= 20) //пока до 100 не дойдет
			{
				maxNumShapes++; //добавляет по фигуре каждые 10 игр
			}
			else if(progressiveGenerations && generation > 20) // сбрасывает адаптацию  после 100 поколения
			{
				progressiveGenerations = false;
			}

			allGames = [];
			activeGames = [];

			if(differentGames)
				nextShapes = [];

			pickShape();
			nextShapes.push(nextShape);
			pickShape();
			nextShapes.push(nextShape);

			//Создание игры для новых игроков
			for(var i = 0; i < newMlPlayers.length; i++)
			{
				let game = new MLGame(I, O, T, S, Z, J, L, newMlPlayers[i]);
				allGames.push(game);
				activeGames.push(game);
			}
		}

		//Нет игр, создает новые - с добавлением фигур
		if(allGames.length == 0)
		{
			for(var i = 0; i < totalPopulation; i++)
			{
				let game = new MLGame(I, O, T, S, Z, J, L, new MLPlayer());
				allGames.push(game);
				activeGames.push(game);
			}
			pickShape();
			nextShapes.push(nextShape);
			pickShape();
			nextShapes.push(nextShape);
		}

		//Для каждой активной игры
		for(var i = 0; i < activeGames.length; i++)
		{
			if(activeGames[i].shapes.length == 0 || activeGames[i].shapes[activeGames[i].shapes.length - 1].locked) //Если гра только началась
			{
				if(activeGames[i].shapes.length == nextShapes.length - 1) // Добавление новой фигуры , которая будет добавлена в следующую игру
				{
					if(progressiveGenerations && nextShapes.length < maxNumShapes)
					{
						activeGames[i].addShape(nextShapes[activeGames[i].shapes.length]);
					}
					else if(progressiveGenerations) //Достигает количества фигур - игра заканчивается
					{
						activeGames[i].defeat = true;
						activeGames[i].updateStats();
					}
					else //Когда отключена адаптация - добавляет фигуры как обычно
					{
						activeGames[i].addShape(nextShapes[activeGames[i].shapes.length]);
					}
						pickShape();
						nextShapes.push(nextShape);
				}
				else if(activeGames[i].shapes.length < nextShapes.length)
				{
					if(progressiveGenerations && activeGames[i].shapes.length < maxNumShapes)
					{
						activeGames[i].addShape(nextShapes[activeGames[i].shapes.length]);
					}
					else if(progressiveGenerations)
					{
						activeGames[i].defeat = true;
						activeGames[i].updateStats();
					}
					else
					{
						activeGames[i].addShape(nextShapes[activeGames[i].shapes.length]);
					}
				}
			}

			//Позволяет подумать несколько раз для машины
			for(var j = 0; j < numPredicts; j++)
			{
				let action = activeGames[i].player.think(addCurShapeMap(i));
				activeGames[i].executeAction(action);
			}
			activeGames[i].play();
			if(activeGames[i].defeat)
			{
				//allGames[i] = JSON.parse(JSON.stringify(activeGames[i]));
				allGames[i] = activeGames[i];
				activeGames.splice(i, 1);
				gamesPlayed++;
			}
		}

		//Отрисовка следующей фигуры
		fill(0, 0, 0);
		rect(250, 10, 90, 116);
		if(activeGames.length > 0)
			image(nextShapes[activeGames[0].shapes.length][0], 240 + (110 - nextShapes[activeGames[0].shapes.length][0].width) / 2, 10 + (116 - nextShapes[activeGames[0].shapes.length][0].height) / 2);

		//Обновление статистики
    updateStats();

		//Отображение счета
		textAlign(CENTER);
		textSize(15);
		fill(255);
		if(activeGames.length > 0)
			text('Счет: ' + activeGames[0].score, 295, 145);

		strokeWeight(1.8);
		textSize(11);
		text('Идет\n' + activeGames.length + " из " + totalPopulation, 295, 160);
		text('Ср.Разница Высот.\n' + nf(averageHeightDiffs, 0, 2), 295, 190);
		text('Ср. Плотность\n' + nf(averageDensity, 0, 3), 295, 220);
		text('Ср. Кол. Дыр\n' + nf(averageNumHoles, 0, 2), 295, 250);
		text('Ср. Счет\n' + nf(averageScore, 0, 2), 295, 280);
		text('Макс. Счет\n' + nf(maxScore, 0, 2), 295, 310);
		text('Макс. Очищ. Линий\n' + maxLinesRemoved, 295, 340);
		text('Макс. Адап.\n' + nf(maxFitness, 0, 8), 295, 370);
		text('Поколение ' + generation, 295, 400);

		//Отрисовка первой игры в массиве
		if(activeGames.length > 0)
		{
			for(var i = 0; i < activeGames[0].shapes.length; i++)
			{
				strokeWeight(3);
				stroke(0);
				activeGames[0].shapes[i].show();
			}
		}

}
