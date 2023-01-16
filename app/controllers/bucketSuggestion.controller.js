const buckets = require('../models/bucket.model')
const bucketHelper = require('../helper/bucketHelper')



class bucket {

	async calculateEmptyVolume(req, res) {
		let bucketVolume
		let bucketDetails
		// checking for the request is for new session or not
		if (req.body.newSession.toString() == 'true') {
			// condition made to check sessionName is already exist in DB or not.
			const isSessionNameExist = await buckets.findOne({sessionName: req.body.sessionName}).lean()
			if (isSessionNameExist) {
				return res.status(400).send({
					status: false,
					msg: 'Session name already exists'
				})
			}
			bucketVolume = req.body.bucketVolume.map((x) => {
				return { ...x, emptyVolume: x.volume }
			})
			delete req.body.bucketVolume
			// saving the bucket details in DB
			const saveVolume = new buckets({
				...req.body,
				bucketVolume
			})
			await saveVolume.save();
		} else if (req.body.newSession.toString() == 'false') {
			// if session is not new then fetching details from DB about the session
			bucketDetails = await buckets.findOne({ sessionName: req.body.sessionName }).lean()
			console.log('bucketDetails', bucketDetails, req.body.sessionName)
			bucketVolume = bucketDetails.bucketVolume
		}
		// volume of all the balls entered by the user
		const pink = req.body.ballsVolume.find(x => x.name === 'pink').volume
		const red = req.body.ballsVolume.find(x => x.name === 'red').volume
		const blue = req.body.ballsVolume.find(x => x.name === 'blue').volume
		const orange = req.body.ballsVolume.find(x => x.name === 'orange').volume
		const green = req.body.ballsVolume.find(x => x.name === 'green').volume

		// quantity of all balls
		const pinkBalls = req.body.numOfBalls.find(x => x.name === 'pink').quantity
		const redBalls = req.body.numOfBalls.find(x => x.name === 'red').quantity
		const blueBalls = req.body.numOfBalls.find(x => x.name === 'blue').quantity
		const orangeBalls = req.body.numOfBalls.find(x => x.name === 'orange').quantity
		const greenBalls = req.body.numOfBalls.find(x => x.name === 'green').quantity
		const bucketArray = []
		if (req.body.newSession.toString() == 'true') {
			bucketDetails = await buckets.findOne({ sessionName: req.body.sessionName }).lean()
			console.log(bucketDetails)
			bucketVolume = bucketDetails.bucketVolume
		}
		// looping all the bucket and checking how many balls will take to fill the empty space
		for (const iterator of bucketVolume) {
			// For pink balls
			let getPink = Math.floor(iterator.emptyVolume / pink)
			getPink = bucketHelper.checkRemainingBalls(pinkBalls, getPink)
			let redBall = 0
			let blueBall = 0
			let orangeBall = 0
			let greenBall = 0
			// For red balls
			if (getPink * pink !== iterator.emptyVolume) {
				const occBalls = parseInt(((iterator.emptyVolume - (getPink * pink)) / red).toString().split('.')[0])
				redBall = bucketHelper.checkRemainingBalls(redBalls, occBalls)
			}
			// Blue balls
			if (getPink * pink + redBall * red !== iterator.emptyVolume) {
				const totalBalls = iterator.emptyVolume - (getPink * pink + redBall * red)
				const blueOccBalls = parseInt((totalBalls / blue).toString().split('.')[0])
				blueBall = bucketHelper.checkRemainingBalls(blueBalls, blueOccBalls)
			}
			// orange balls
			if (getPink * pink + redBall * red + blueBall * blue !== iterator.emptyVolume) {
				const totalBall = iterator.emptyVolume - (getPink * pink + redBall * red + blueBall * blue)
				const orangeOccBalls = (totalBall / orange).toString().split('.')[0]
				orangeBall = bucketHelper.checkRemainingBalls(orangeBalls, orangeOccBalls)
			}
			// Green balls
			if (getPink * pink + redBall * red + blueBall * blue + orangeBall * orange !== iterator.emptyVolume) {
				const totalBalls = getPink * pink + redBall * red + blueBall * blue + orangeBall * orange
				const greenOccuBalls = parseInt(((iterator.emptyVolume - totalBalls) / green).toString().split('.')[0])
				greenBall = bucketHelper.checkRemainingBalls(greenBalls, greenOccuBalls)
			}
			// calculating the empty volume of each bucket
			const currentVolume = getPink * pink + redBall * red + blueBall * blue + orangeBall * orange + greenBall * green
			const emptyVolume = iterator.emptyVolume - currentVolume

			// updating the empty volume in DB
			await buckets.updateOne({ _id: bucketDetails._id, "bucketVolume._id": iterator._id },
				{ $set: { "bucketVolume.$.emptyVolume": emptyVolume } });
			let suggestion
			if (emptyVolume !== 0) {
				suggestion = bucketHelper.giveSuggestionOfBalls(emptyVolume, { pink, orange, green, blue, red })
			}
			// Here is the final output of each bucket
			const finalMsg = emptyVolume > 0 ? `Bucket ${iterator.name} : Place ${getPink} pink balls, ${redBall} red balls, ${blueBall} blue balls, ${orangeBall} orange balls and ${greenBall} orange balls.`: `Bucket ${iterator.name} is filled completely.`
			if (emptyVolume !== 0) {
				bucketArray.push({ bucket: iterator.name, pink: suggestion.pink, red: suggestion.red, blue: suggestion.blue, orange: suggestion.orange, 
					green: suggestion.green, emptyVolume: emptyVolume, msg: finalMsg, })
			}	else {
				bucketArray.push({ bucket: iterator.name, pink: 0, red: 0, blue: 0, orange: 0, 
					green: 0, emptyVolume: emptyVolume, msg: finalMsg, })
			}

		}
		return res.status(200).send({
			status: true,
			result: bucketArray
		})
	}
}



module.exports = bucket