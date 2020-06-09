class Tetrominu
{
	constructor(imgs)
	{
		this.index = 0;
		this.imgs = imgs;
		this.img = imgs[0];
		this.x = 72;
		this.y = - this.img.height;
		this.speed = 24;
		this.width = this.img.width;
		this.height = this.img.height;
		this.locked = false;
		this.moved = false;
		this.state = 0;

		if(imgs === I)
		{
			this.positions = [[3,-4], [3,-3], [3, -2], [3, -1]];
			this.rotationStates = 2;
			this.color = color(0, 146, 255);
		}
		else if(imgs === O)
		{
			this.positions = [[3,-2], [4,-2], [3, -1], [4, -1]];
			this.rotationStates = 0;
			this.color = color(73, 0, 255);
		}
		else if(imgs === T)
		{
			this.positions = [[3,-2], [4,-2], [5, -2], [4, -1]];
			this.rotationStates = 4;
			this.color = color(255, 219, 0);
		}
		else if(imgs === S)
		{
			this.positions = [[3,-1], [4,-1], [4, -2], [5, -2]];
			this.rotationStates = 2;
			this.color = color(0, 255, 146);
		}
		else if(imgs === Z)
		{
			this.positions = [[3,-2], [4,-2], [4, -1], [5, -1]];
			this.rotationStates = 2;
			this.color = color(255, 0, 219);
		}
		else if(imgs === J)
		{
			this.positions = [[3,-1], [4,-1], [4, -2], [4, -3]];
			this.rotationStates = 4;
			this.color = color(255, 0, 0);
		}
		else if(imgs === L)
		{
			this.positions = [[3,-1], [3,-2], [3, -3], [4, -1]];
			this.rotationStates = 4;
			this.color = color(73, 255, 0);
		}

	}

	show()
	{
		fill(this.color);

		for(let j = 0; j < this.positions.length; j++)
		{
			rect(this.positions[j][0] * 24, this.positions[j][1] * 24, 24, 24);
		}
	}

	descend()
	{
		this.y += this.speed;
		for(var i = 0; i < this.positions.length; i++)
			this.positions[i][1] += 1;
	}

	rotate()
	{
		if(this.index == this.imgs.length - 1)
			this.index = 0;
		else
			this.index += 1;

		if(this.imgs[this.index].height + this.y <= 480)
		{
			this.img = this.imgs[this.index];
			this.width = this.img.width;
			this.height = this.img.height;

			if(this.imgs === I)
			{
				if(this.state == 0)
					this.state++;
				else
					this.state = 0;

				if(this.state == 0)
				{
					this.positions[1][0] = this.x / 24; this.positions[1][1] = this.y / 24 + 1;
					this.positions[2][0] = this.x / 24; this.positions[2][1] = this.y / 24 + 2;
					this.positions[3][0] = this.x / 24; this.positions[3][1] = this.y / 24 + 3;
				}
				else
				{
					this.positions[1][0] = this.x / 24 + 1; this.positions[1][1] = this.y / 24;
					this.positions[2][0] = this.x / 24 + 2; this.positions[2][1] = this.y / 24;
					this.positions[3][0] = this.x / 24 + 3; this.positions[3][1] = this.y / 24;
				}
			}
			else if(this.imgs === T)
			{
				if(this.state != 3)
					this.state++;
				else
					this.state = 0;

				if(this.state == 0)
				{
					this.positions[0][0] = this.x / 24; this.positions[0][1] = this.y / 24;
					this.positions[1][0] = this.x / 24 + 1; this.positions[1][1] = this.y / 24;
					this.positions[2][0] = this.x / 24 + 2; this.positions[2][1] = this.y / 24;
					this.positions[3][0] = this.x / 24 + 1; this.positions[3][1] = this.y / 24 + 1;
				}
				else if(this.state == 1)
				{
					this.positions[0][0] = this.x / 24 + 1; this.positions[0][1] = this.y / 24;
					this.positions[1][0] = this.x / 24 + 1; this.positions[1][1] = this.y / 24 + 1;
					this.positions[2][0] = this.x / 24 + 1; this.positions[2][1] = this.y / 24 + 2;
					this.positions[3][0] = this.x / 24; this.positions[3][1] = this.y / 24 + 1;
				}
				else if(this.state == 2)
				{
					this.positions[0][0] = this.x / 24 + 1; this.positions[0][1] = this.y / 24;
					this.positions[1][0] = this.x / 24; this.positions[1][1] = this.y / 24 + 1;
					this.positions[2][0] = this.x / 24 + 1; this.positions[2][1] = this.y / 24 + 1;
					this.positions[3][0] = this.x / 24 + 2; this.positions[3][1] = this.y / 24 + 1;
				}
				else if(this.state == 3)
				{
					this.positions[0][0] = this.x / 24; this.positions[0][1] = this.y / 24;
					this.positions[1][0] = this.x / 24; this.positions[1][1] = this.y / 24 + 1;
					this.positions[2][0] = this.x / 24; this.positions[2][1] = this.y / 24 + 2;
					this.positions[3][0] = this.x / 24 + 1; this.positions[3][1] = this.y / 24 + 1;
				}
			}
			else if(this.imgs === S)
			{
				if(this.state == 0)
					this.state++;
				else
					this.state = 0;

				if(this.state == 0)
				{
					this.positions[0][0] = this.x / 24 + 1; this.positions[0][1] = this.y / 24;
					this.positions[1][0] = this.x / 24 + 2; this.positions[1][1] = this.y / 24;
					this.positions[2][0] = this.x / 24; this.positions[2][1] = this.y / 24 + 1;
					this.positions[3][0] = this.x / 24 + 1; this.positions[3][1] = this.y / 24 + 1;
				}
				else if(this.state == 1)
				{
					this.positions[0][0] = this.x / 24; this.positions[0][1] = this.y / 24;
					this.positions[1][0] = this.x / 24; this.positions[1][1] = this.y / 24 + 1;
					this.positions[2][0] = this.x / 24 + 1; this.positions[2][1] = this.y / 24 + 1;
					this.positions[3][0] = this.x / 24 + 1; this.positions[3][1] = this.y / 24 + 2;
				}
			}
			else if(this.imgs === Z)
			{
				if(this.state == 0)
					this.state++;
				else
					this.state = 0;

				if(this.state == 0)
				{
					this.positions[0][0] = this.x / 24; this.positions[0][1] = this.y / 24;
					this.positions[1][0] = this.x / 24 + 1; this.positions[1][1] = this.y / 24;
					this.positions[2][0] = this.x / 24 + 1; this.positions[2][1] = this.y / 24 + 1;
					this.positions[3][0] = this.x / 24 + 2; this.positions[3][1] = this.y / 24 + 1;
				}
				else if(this.state == 1)
				{
					this.positions[0][0] = this.x / 24 + 1; this.positions[0][1] = this.y / 24;
					this.positions[1][0] = this.x / 24; this.positions[1][1] = this.y / 24 + 1;
					this.positions[2][0] = this.x / 24 + 1; this.positions[2][1] = this.y / 24 + 1;
					this.positions[3][0] = this.x / 24; this.positions[3][1] = this.y / 24 + 2;
				}
			}
			else if(this.imgs === J)
			{
				if(this.state != 3)
					this.state++;
				else
					this.state = 0;

				if(this.state == 0)
				{
					this.positions[0][0] = this.x / 24 + 1; this.positions[0][1] = this.y / 24;
					this.positions[1][0] = this.x / 24 + 1; this.positions[1][1] = this.y / 24 + 1;
					this.positions[2][0] = this.x / 24 + 1; this.positions[2][1] = this.y / 24 + 2;
					this.positions[3][0] = this.x / 24; this.positions[3][1] = this.y / 24 + 2;
				}
				else if(this.state == 1)
				{
					this.positions[0][0] = this.x / 24; this.positions[0][1] = this.y / 24;
					this.positions[1][0] = this.x / 24; this.positions[1][1] = this.y / 24 + 1;
					this.positions[2][0] = this.x / 24 + 1; this.positions[2][1] = this.y / 24 + 1;
					this.positions[3][0] = this.x / 24 + 2; this.positions[3][1] = this.y / 24 + 1;
				}
				else if(this.state == 2)
				{
					this.positions[0][0] = this.x / 24; this.positions[0][1] = this.y / 24;
					this.positions[1][0] = this.x / 24 + 1; this.positions[1][1] = this.y / 24;
					this.positions[2][0] = this.x / 24; this.positions[2][1] = this.y / 24 + 1;
					this.positions[3][0] = this.x / 24; this.positions[3][1] = this.y / 24 + 2;
				}
				else if(this.state == 3)
				{
					this.positions[0][0] = this.x / 24; this.positions[0][1] = this.y / 24;
					this.positions[1][0] = this.x / 24 + 1; this.positions[1][1] = this.y / 24;
					this.positions[2][0] = this.x / 24 + 2; this.positions[2][1] = this.y / 24;
					this.positions[3][0] = this.x / 24 + 2; this.positions[3][1] = this.y / 24 + 1;
				}
			}
			else if(this.imgs === L)
			{
				if(this.state != 3)
					this.state++;
				else
					this.state = 0;

				if(this.state == 0)
				{
					this.positions[0][0] = this.x / 24; this.positions[0][1] = this.y / 24;
					this.positions[1][0] = this.x / 24; this.positions[1][1] = this.y / 24 + 1;
					this.positions[2][0] = this.x / 24; this.positions[2][1] = this.y / 24 + 2;
					this.positions[3][0] = this.x / 24 + 1; this.positions[3][1] = this.y / 24 + 2;
				}
				else if(this.state == 1)
				{
					this.positions[0][0] = this.x / 24; this.positions[0][1] = this.y / 24;
					this.positions[1][0] = this.x / 24 + 1; this.positions[1][1] = this.y / 24;
					this.positions[2][0] = this.x / 24 + 2; this.positions[2][1] = this.y / 24;
					this.positions[3][0] = this.x / 24; this.positions[3][1] = this.y / 24 + 1;
				}
				else if(this.state == 2)
				{
					this.positions[0][0] = this.x / 24; this.positions[0][1] = this.y / 24;
					this.positions[1][0] = this.x / 24 + 1; this.positions[1][1] = this.y / 24;
					this.positions[2][0] = this.x / 24 + 1; this.positions[2][1] = this.y / 24 + 1;
					this.positions[3][0] = this.x / 24 + 1; this.positions[3][1] = this.y / 24 + 2;
				}
				else if(this.state == 3)
				{
					this.positions[0][0] = this.x / 24 + 2; this.positions[0][1] = this.y / 24;
					this.positions[1][0] = this.x / 24; this.positions[1][1] = this.y / 24 + 1;
					this.positions[2][0] = this.x / 24 + 1; this.positions[2][1] = this.y / 24 + 1;
					this.positions[3][0] = this.x / 24 + 2; this.positions[3][1] = this.y / 24 + 1;
				}
			}
		}
		else
		{
			if(this.index == 0)
				this.index = this.imgs.length - 1;
			else
				this.index -= 1;
		}
	}
}
