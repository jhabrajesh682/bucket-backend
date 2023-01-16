

function checkRemainingBalls(totalBalls, occupiedBalls) {
	console.log(totalBalls, occupiedBalls);
	if (occupiedBalls === totalBalls) {
		return occupiedBalls
	} else if (occupiedBalls > totalBalls) {
		return totalBalls
	} else if (occupiedBalls < totalBalls) {
		return occupiedBalls
	}
}
function giveSuggestionOfBalls(emptyVolume, ballVolume) {

	let getPink = Math.floor(emptyVolume / ballVolume.pink)
	let redBall = 0
	let blueBall = 0
	let orangeBall = 0
	let greenBall = 0
	if (getPink * ballVolume.pink !== emptyVolume) {
		redBall = parseInt(((emptyVolume - (getPink * ballVolume.pink)) / ballVolume.red).toString().split('.')[0])
	}
	if (getPink * ballVolume.pink + redBall * ballVolume.red !== emptyVolume) {
		const totalBalls = emptyVolume - (getPink * ballVolume.pink + redBall * ballVolume.red)
		blueBall = parseInt((totalBalls / ballVolume.blue).toString().split('.')[0])
	}
	if (getPink * ballVolume.pink + redBall * ballVolume.red + blueBall * ballVolume.blue !== emptyVolume) {
		const totalBall = emptyVolume - (getPink * ballVolume.pink + redBall * ballVolume.red + blueBall * ballVolume.blue)
		orangeBall = parseInt((totalBall / ballVolume.orange).toString().split('.')[0])
	}
	if (getPink * ballVolume.pink + redBall * ballVolume.red + blueBall * ballVolume.blue + orangeBall * ballVolume.orange !== emptyVolume) {
		const totalBalls = getPink * ballVolume.pink + redBall * ballVolume.red + blueBall * ballVolume.blue + orangeBall * ballVolume.orange
		greenBall = parseInt(((emptyVolume - totalBalls) / ballVolume.green).toString().split('.')[0])
	}
	return { pink: getPink, red: redBall, blue: blueBall, orange: orangeBall, green: greenBall }
}


module.exports = {
  checkRemainingBalls,
  giveSuggestionOfBalls
}