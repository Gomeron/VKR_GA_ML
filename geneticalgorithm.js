// Создание новго поколения, сам алгоритм
function generate(allGames)
{
  let newPlayers = [];

  //Сортировка игры по приспособленности
  allGames.sort(function(a, b) {
  return b.fitness - a.fitness;
});

  //Добавление 10 процентов в следующее поколении
  for(let i = 0; i < floor(allGames.length / 10); i++)
  {
    newPlayers[i] = allGames[i].player;
  }

  // Выбираются родители по приспособленности, применяется мутация и добавляется к слудующему поколонеию
  for (let i = floor(allGames.length / 10); i < allGames.length; i++)
  {
    // ВЫбираются игры по  приспособленности
    let parent1 = poolSelection(allGames);
    let parent2 = poolSelection(allGames);

    let newMlPlayer = crossOver(parent1, parent2);
    mutate(newMlPlayer, mutationRate);
    newPlayers[i] = newMlPlayer;
  }
  return newPlayers;
}

//Выбираются родители применяется скрещивание  и мутация
function crossOver(parent1, parent2)
{
		let parent1_in = parent1.brain.input_weights.dataSync();
		let parent1_out = parent1.brain.output_weights.dataSync();
    let parent2_in = parent2.brain.input_weights.dataSync();
		let parent2_out = parent2.brain.output_weights.dataSync();

// Находим индекс, который будет определять, сколько днк  ребенок получит от каждого родителя
		let index = floor(random(1, parent1_in.length));

    //Наследуются несколько генов от первого родителя, остальные от второго
    let child_in = [...parent1_in.slice(0, index), ...parent2_in.slice(index, parent2_in.length)];

    index = floor(random(1, parent1_out.length));

    let child_out = [...parent1_out.slice(0, index), ...parent2_out.slice(index, parent2_out.length)];

    //Получаем форму тензоров
		let input_shape = parent1.brain.input_weights.shape;
		let output_shape = parent1.brain.output_weights.shape;

    //Создаем новые тензоры опираясь на новые весы
    child_in = tf.tensor(child_in, input_shape);
    child_out = tf.tensor(child_out, output_shape);

    //Создание нейронки с новыми весами
		let child_brain = new NeuralNetwork(240, 120, 4, child_in, child_out);

    //Возвращаем нового игрока с новым мозгом
    return new MLPlayer(child_brain);
}

//Изменяем некоторые свойства опираясь на вероятность мутации
function mutate(newMlPlayer, mutationRate)
{
  //Получение весов из тензора
	let input_weights = newMlPlayer.brain.input_weights.dataSync();

  //Мутируем случайным образом
  for(let i = 0; i < input_weights.length; i++)
  {
    if(random(1) < mutationRate)
    {
      let offset = randomGaussian() * 0.5;
      input_weights[i] += offset;
    }
  }

  let output_weights = newMlPlayer.brain.output_weights.dataSync();

  for(let i = 0; i < output_weights.length; i++)
  {
    if(random(1) < mutationRate)
    {
      let offset = randomGaussian() * 0.5;
      output_weights[i] += offset;
    }
  }

	let input_shape = newMlPlayer.brain.input_weights.shape;
  let output_shape = newMlPlayer.brain.output_weights.shape;

  //Сбрасываем старые веса - создаем новые
	newMlPlayer.brain.input_weights.dispose();
	newMlPlayer.brain.input_weights = tf.tensor(input_weights, input_shape);

	newMlPlayer.brain.output_weights.dispose();
	newMlPlayer.brain.output_weights = tf.tensor(output_weights, output_shape);
}

// Адаптацию приводим к нормальному виду
function normalizeFitness() {

  //Делаем копию игр
  games = JSON.parse(JSON.stringify(allGames));

  for (let i = 0; i < games.length; i++) {
    games[i].score = pow(games[i].score, 2);
  }

  // складываем все счета
  let sum = 0;
  for (let i = 0; i < games.length; i++) {
    sum += games[i].score;
  }

  for (let i = 0; i < games.length; i++) {
    allGames[i].fitness = games[i].score / sum;
  }
}

// Берем  игры с лучшей адаптацией , у них выше вероятность попасть в следующее поколение
function poolSelection(allGames) {

  let index = 0;

  let r = random(1);


  while (r > 0)
  {
    r -= allGames[index].fitness;
    index += 1;
  }

  index -= 1;

  //Возвращаем игру с лучшей адаптацией
  return allGames[index].player;
}
