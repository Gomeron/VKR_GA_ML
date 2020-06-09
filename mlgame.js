class MLGame
{
  //Предварительная загрущкаи и настройка
  constructor(I_, O_, T_, S_, Z_, J_, L_, mlplayer)
  {
    this.I = I_;
    this.O = O_;
    this.T = T_;
    this.S = S_;
    this.Z = Z_;
    this.J = J_;
    this.L = L_;
    this.shapes = [];
    this.score = 0;
    this.landedMap = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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

    this.speedUp = true;
    this.defeat = false;
    this.speed = 112400;
    this.player = mlplayer;

    this.linesRemoved = 0;
    this.numShapesAdded = 0;
    this.density = 0;
    this.level = 0;
    this.heights_sum = 0;
    this.heightDifferences_sum = 0;
    this.holes = 0;
    this.fitness = 0;


    this.lastIndex = 0;
  }

  executeAction(action)
  {
  	if(!this.shapes[this.shapes.length - 1].locked && !this.defeat)
  	{
      if(action[3] > 0.9) //W
  		{
  			this.tryRotate();
  		}
  		else if(action[0] > 0.5) //A
  		{
  			this.tryMoveLeft();
  		}
  		else if(action[1] > 0.5) //D
  		{
  			this.tryMoveRight();
  		}
  		else if(action[2] > 0.5) //S
  		{
  			this.drop();
  		}
  	}
  }

  tryMoveLeft()
  {
  	if(this.shapes[this.shapes.length - 1].x >= 24 && !this.checkHorizontalCollisions(1))
  	{
  		this.shapes[this.shapes.length - 1].x -= 24;
  		for(let i = 0; i < this.shapes[this.shapes.length - 1].positions.length; i++)
  			this.shapes[this.shapes.length - 1].positions[i][0] -= 1;
  	}
  }

  tryMoveRight()
  {
  	if(this.shapes[this.shapes.length - 1].x < gameWidth - this.shapes[this.shapes.length - 1].width && !this.checkHorizontalCollisions(0))
  	{
  		this.shapes[this.shapes.length - 1].x += 24;
  		for(let i = 0; i < this.shapes[this.shapes.length - 1].positions.length; i++)
  			this.shapes[this.shapes.length - 1].positions[i][0] += 1;
  	}
  }

  tryRotate()
  {
  	if(!this.checkRotationCollisions())
  	{
  		this.shapes[this.shapes.length - 1].rotate();
  	}
  }

  drop()
  {
  	frameRate(60);
  	this.speedUp = true;
  	while(!this.shapes[this.shapes.length - 1].locked)
  		this.shapesDescend(this.speedUp);
  	this.speedUp = false;
    if(!progressiveGenerations)
  	 this.score += 40;
    frameRate(2);
  }

  addShape(shape)
  {
  	if(shape)
  	{
  		this.shapes.push(new Tetrominu(shape));
  	}
  	this.lastIndex = this.shapes.length - 1;
    this.numShapesAdded++;
  }

  updateStats()
  {
    let empty = true;
  	let usedLines = 0;

  	for(let j = 0; j < 20; j++)
  	{
  		for(let k = 0; k < 10; k++)
  		{
  			if(this.landedMap[j][k] != 0)
  			{
  				empty = false;
  			}
  		}
  		if(!empty)
  			usedLines++;
  		empty = true;
  	}

    let squaresOccupied = 0;

    for(let j = 0; j < 20; j++)
  	{
  		for(let k = 0; k < 10; k++)
  		{
  			if(this.landedMap[j][k] == 1)
  				squaresOccupied++;
  		}
  	}

    this.level = usedLines;
    this.density = squaresOccupied / (usedLines * 10);

    this.holes = 0;
    for(let j = 0; j < 10; j++) //For each column
  	{
      let occupied = false;
  		for(let k = 0; k < 20; k++)
  		{
  			if(this.landedMap[k][j] == 1)
  				occupied = true;

        if(this.landedMap[k][j] == 0 && occupied)
    			this.holes++;
  		}
  	}

    this.heights = [];
    for(let j = 0; j < 10; j++)
  	{
  		for(let k = 0; k < 20; k++)
  		{
  			if(this.landedMap[k][j] == 1)
        {
  				this.heights[this.heights.length] = 20 - k;
          break;
        }
  		}
  	}

    this.heightDifferences = [];
    for(let j = 0; j < this.heights.length - 1; j++)
      this.heightDifferences[j] = abs(this.heights[j + 1] - this.heights[j]);

    this.maxHeight = max(this.heights);

    this.heights_sum = 0;
    for(let j = 0; j < this.heights.length; j++)
    {
      this.heights_sum += this.heights[j];
    }

    this.heightDifferences_sum = 0;
    for(let j = 0; j < this.heightDifferences.length; j++)
    {
      this.heightDifferences_sum += this.heightDifferences[j];
    }

    if(this.defeat)
    {
      if(!progressiveGenerations)
        this.score += this.numShapesAdded * 10;
      else
        this.score += 5000;

      this.score -= this.holes * 100;

      this.score -= this.heightDifferences_sum * 100;

      this.score = this.score * (this.density * 2);

      if(this.score < 0)
        this.score = 1;
    }
  }

  updateSpeed()
  {
  	let newFrameRate = map(speed, 24, 120, 2, 60);
  	frameRate(newFrameRate);
  }

  shapesDescend(checkSpeed)
  {
  	if(!checkSpeed)
  		this.updateSpeed();

  	if(this.shapes[this.shapes.length - 1].y >= gameHeight - this.shapes[this.shapes.length - 1].height)
  	{
  		this.shapes[this.shapes.length - 1].locked = true;
  	}

  	if(this.shapes[this.shapes.length - 1].y + this.shapes[this.shapes.length - 1].speed >= gameHeight - this.shapes[this.shapes.length - 1].height)
  	{
  		this.shapes[this.shapes.length - 1].speed = 24;
  	}

  	if(!this.shapes[this.shapes.length - 1].locked)
  	{
  		if(!this.checkCollisions(this.shapes[this.shapes.length - 1]))
  			this.shapes[this.shapes.length - 1].descend();
  	}

  	if(this.shapes[this.shapes.length - 1].locked)
  	{
  		if(this.shapes[this.shapes.length - 1].y >= 0)
  		{
  			for(let i = 0; i < this.shapes[this.shapes.length - 1].positions.length; i++)
  			{
  				let x = this.shapes[this.shapes.length - 1].positions[i][0];
  				let y = this.shapes[this.shapes.length - 1].positions[i][1];
          if(x <= 9 && y <= 19)
  				    this.landedMap[y][x] = 1;
  			}
  		}

  		this.removeLine();
  	}
  }

  checkCollisions(shape)
  {
  	for(let i = 0; i < this.shapes[this.shapes.length - 1].positions.length; i++)
  	{
  		let x = shape.positions[i][0];
  		let y = shape.positions[i][1];
  		if(x >= 0 && y >= 0 && y + 1 <= 19)
  			if(this.landedMap[y + 1][x] != 0)
  			{
  				shape.locked = true;
  				return true;
  			}
  	}
  	return false;
  }

  checkHorizontalCollisions(side)
  {
  	let temp = JSON.parse(JSON.stringify(this.shapes[this.shapes.length - 1].positions));
  	for(let i = 0; i < temp.length; i++)
  	{
  		if(side == 1)
  			temp[i][0]--;
  		else if(side == 0)
  			temp[i][0]++;
  	}

  	for(let i = 0; i < temp.length; i++)
  	{
  		let x = temp[i][0];
  		let y = temp[i][1];
  		if(x >= 0 && y >= 0 && y<= 19)
  		{
  			if(this.landedMap[y][x] != 0)
  			{
  				return true;
  			}
  		}
  	}
  	return false;
  }

  checkRotationCollisions()
  {
  	let state = this.shapes[this.shapes.length - 1].state;
  	this.shapes[this.shapes.length - 1].rotate();
  	let temp = JSON.parse(JSON.stringify(this.shapes[this.shapes.length - 1].positions));

  	while(this.shapes[this.shapes.length - 1].state != state)
  		this.shapes[this.shapes.length - 1].rotate();

  	for(let i = 0; i < temp.length; i++)
  	{
  		let x = temp[i][0];
  		let y = temp[i][1];
  		if(x >= 0 && y >= 0 && y<= 19)
  		{
  			if(this.landedMap[y][x] != 0)
  			{
  				return true;
  			}
  		}
  	}
  	return false;
  }

  checkDefeat()
  {
  	for(let i = 0; i < this.shapes.length; i++)
  	{
  		if(this.shapes[i].locked && this.shapes[i].y < 0)
  			this.defeat = true;
  	}
  }

  removeLine()
  {
  	let full = true;
  	let lines = [];

  	for(let i = 0; i < 20; i++)
  	{
  		for(let j = 0; j < 10; j++)
  		{
  			if(this.landedMap[i][j] != 1)
  			{
  				full = false;
  			}
  		}
  		if(full)
  			lines.push(i);
  		full = true;
  	}

  	for(let i = 0; i < lines.length; i++)
  	{
  		for(let j = 0; j < this.shapes.length; j++)
  		{
  			for(let k = this.shapes[j].positions.length - 1; k >= 0; k--)
  			{
  				if(this.shapes[j].positions[k][1] == lines[i])
  				{
  					this.landedMap[lines[i]][this.shapes[j].positions[k][0]] = 0;
  					this.shapes[j].positions.splice(k, 1);
  				}
  			}
  		}
  	}

  	for(let i = 0; i < lines.length; i++)
  	{
  		for(let l = lines[i] - 1; l >= 0; l--)
  		{
  			for(let j = 0; j < this.shapes.length; j++)
  			{
  				for(let k = 0; k < this.shapes[j].positions.length; k++)
  				{
  					if(this.shapes[j].positions[k][1] == l)
  					{
  						this.landedMap[l][this.shapes[j].positions[k][0]] = 0;
  						this.shapes[j].positions[k][1]++;
  						this.landedMap[l + 1][this.shapes[j].positions[k][0]] = 1;
  					}
  				}
  			}
  		}
  	}

    if(lines.length > 0)
    {
    	this.score = this.score + (pow(lines.length + 1, 5) * 100);
      this.linesRemoved += lines.length;
    }
  }

  play()
  {
  	if(!this.defeat)
  	{
  		this.score += 10;

  		this.shapesDescend(this.speedUp);
  	}
  	else
  	{
      this.player.score = this.score;
  	}

  	this.checkDefeat();

    this.updateStats();
  }
}
