module.exports = {
    bareMessage: {
        received: "Your message was received",
        wrong: "Wrong input message",
        curseWords: [{
            id: 2,
            response: "It's not very effective..."
        }, {
            id: 3,
            response: "Fuck you too!"
        }, {
            id: 4,
            response: "¡Nobody could expect the Spanish Inquisition!"
        }]            
    }, 
    ivCalculator: {
        beautifiedOutput: `Your %0 without appraisal with 
[CP: %1] [HP: %2] [Stardust: %3] [Candy: %4]

Select your team`,
        statCalculation: ["ATK", "DEF", "STA", "ATK/DEF", "ATK/STA", "DEF/STA", "ATK/DEF/STA"],
        bestStat: "Its best stat is *%0*",
        leaderAppraisal: {
            i: {
                overall: [
                    "Overall, your %0 looks like it can really battle with the best of them!",
                    "Overall, your %0 is really strong!",
                    "Overall, your %0 is pretty decent!",
                    "Overall, your %0 has room for improvement as far as battling goes"
                ],
                overallShort: [
                    "Looks like it can really battle with the best of them!",
                    "It's really strong!",
                    "It's pretty decent!",
                    "Has room for improvement as far as battling goes"
                ],
                individual: [
                    "Its stats are the best I’ve ever seen! No doubt about it!",
                    "Its stats are really strong! Impressive",
                    "It’s definitely got some good stats. Definitely!",
                    "Its stats are all right, but kinda basic, as far as I can see",
                ],
                individualShort: [
                    "Its stats are the best I’ve ever seen!",
                    "Its stats are really strong!",
                    "It’s definitely got some good stats",
                    "Its stats are all right, but kinda basic",
                ],
                size: [
                    "Wh-whoa. That’s the tiniest %0 I’ve ever seen!",
                    "Your %0 is a little small for its kind, don’t you think?",
                    "Your %0 is a BIG one!",
                    "Your %0 is just HUGE!"
                ],
                sizeShort: [
                    "That’s the tiniest %0 I’ve ever seen!",
                    "It's a little small for its kind, don’t you think?",
                    "It's a BIG one!",
                    "It's just HUGE!"
                ]
            },
            m: {
                overall: [
                    "Overall, your %0 is a wonder! What a breathtaking Pokemon!",
                    "Overall, your %0 has certainly caught my attention",
                    "Overall, your %0 is above average",
                    "Overall, your %0 is not likely to make much headway in battle"
                ],
                overallShort: [
                    "It's a wonder!",
                    "It has certainly caught my attention",
                    "It's above average",
                    "It's not likely to make much headway in battle"
                ],
                individual: [
                    "Its stats exceed my calculations. It's incredible!",
                    "I am certainly impressed by its stats, I must say",
                    "Its stats are noticeably trending to the positive",
                    "Its stats are not out of the norm, in my opinion"
                ],
                individualShort: [
                    "Its stats exceed my calculations",
                    "I am certainly impressed by its stats",
                    "Its stats are trending to the positive",
                    "Its stats are not out of the norm"
                ], 
                size: [
                    "Your %0 is tinier than any we have on record. Astounding",
                    "Your %0 is below average in size",
                    "Your %0 is above average in size",
                    "The size of your %0 is... colossal. This is indeed exceptional. Fascinating!"
                ],
                sizeShort: [
                    "It's tinier than any we have on record",
                    "It's below average in size",
                    "It's above average in size",
                    "Its size is colossal"
                ]
            },
            v: {
                overall: [
                    "Overall, your %0 simply amazes me. It can accomplish anything!",
                    "Overall, your %0 is a strong Pokemon. You should be proud!",
                    "Overall, your %0 is a decent Pokemon",
                    "Overall, your %0 may not be great in battle, but I still like it!"
                ],
                overallShort: [
                    "It simply amazes me",
                    "It's a strong Pokemon",
                    "It's a decent Pokemon",
                    "It may not be great in battle"
                ],
                individual: [
                    "I’m blown away by its stats. WOW!",
                    "It’s got excellent stats! How exciting!",
                    "Its stats indicate that in battle, it’ll get the job done",
                    "Its stats don’t point to greatness in battle"
                ],
                individualShort: [
                    "I’m blown away by its stats",
                    "It’s got excellent stats!",
                    "Its stats indicate that will get the job done",
                    "Its stats don’t point to greatness"
                ],
                size: [
                    "Your %0 is so tiny, I almost didn’t notice it!",
                    "Aww, what a small %0! It’s rather cute, I’d say",
                    "Your %0 is rather sizable, that’s for sure!",
                    "Your %0 is gigantic—the largest I’ve ever seen!"
                ],
                sizeShort: [
                    "Your %0 is so tiny",
                    "Aww, what a small %0!",
                    "Your %0 is rather sizable",
                    "Your %0 is gigantic"
                ]
            }
        },
        overallAppraisalPrompt: "Select overall appraisal:",
        individualAppraisalPrompt: "Select stat appraisal:",
        statPrompt: "Select the best stat:",
        result: `The results for your *%0*
IVs: *%1*
Stats: %2/%3/%4`
    },
    fallback: {
        ivCalculator: {
            beautifiedOutput: "no ingresado"
        }
    }
}