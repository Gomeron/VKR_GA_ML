class MLPlayer
{
  constructor(brain)
  {
    if(brain instanceof NeuralNetwork) //если аргумент  прошел используем
    {
      this.brain = brain.clone();
    }
    else //нет аргумента - сздаем свой
    {
      this.brain = new NeuralNetwork(240, 120, 4);
    }
  }

  //предсказываем
  think(info)
  {
    return this.brain.predict([].concat.apply([], info));
  }
}
// ИИ игрок , процедура создания