module.exports = {
    bareMessage: {
        received: "Tu mensaje fue recibido",
        wrong: "Mensaje de entrada incorrecto",
        curseWords: [{
            id: 2,
            response: "No es muy efectivo..."
        }, {
            id: 3,
            response: "¡Vete a la mierda tu también!"
        }, {
            id: 4,
            response: "¡Nadie está esperando a la Inquisición Española!"
        }],
        welcome: `Hola %0, bienvenido a <b>IVCalcGoBot</b>. 
Este bot está actualmente en desarrollo. Si deseas contribuir o reportar issues, por favor
navega a https://github.com/enanox/ivcalcgobotapi.

Los comandos actuales son:
/echo mensaje - Repite el mensaje
/iv Abra cp: 790 hp: 47 s: 3500 c: 3 - Calcula los IVs para el Pokémon con los parámetros indicados.

Autor: @enanox
`,
    support: `Por favor, para validar que los cálculos sean correctos copia el comando de entrada y el mensaje y
envíamelos a @enanox, junto con una captura de pantalla del Pokémon para verificar. 
¡Muchas gracias!`
    }, 
    ivCalculator: {
        beautifiedOutput: `Calculando la valoración de tu *%0*.

¿Cuál es tu equipo?`,
        statCalculation: ["Ataque", "Defensa", "Salud", "At./Def.", "At./Sal.", "Def./Sal.", "At./Def./Sal."],
        bestStat: "Lo mejor que tiene es su *%0*",
        leaderAppraisal: {
            i: {
                overall: [
                    "En su conjunto, ¡tu *%0* puede enfrentarse a los mejores!",
                    "En su conjunto, ¡tu *%0* es realmente fuerte!",
                    "En su conjunto, tu *%0* está bastante bien",
                    "Podría mejorar algo en lo que se refiere combates"
                ],
                overallShort: [
                    "¡Puede enfrentarse a los mejores!",
                    "¡Es realmente fuerte!",
                    "Está bastante bien",
                    "Podría mejorar"
                ],
                individual: [
                    "¡Sus características son lo mejor que he visto nunca! ¡Qué pasada!",
                    "¡Son realmente fuertes! Es impresionante",
                    "Tiene buenas características, sin duda",
                    "Están...bien, supongo"
                ], 
                individualShort: [
                    "¡Son lo mejor que he visto nunca!",
                    "¡Son realmente fuertes!",
                    "Tiene buenas características",
                    "Están...bien, supongo"
                ],
                size: [
                    
                ]
            },
            m: {
                overall: [
                    "En su conjunto, ¡tu *%0* es una maravilla! ¡Qué espécimen tan impresionante!",
                    "En su conjunto, tu *%0* me ha llamado ciertamente la atención",
                    "En su conjunto, tu *%0* está por encima de la media",
                    "En su conjunto, no parece que tu *%0* vaya a llegar muy lejos en combate"
                ],
                overallShort: [
                    "¡Es una maravilla!",
                    "Me ha llamado ciertamente la atención",
                    "Está por encima de la media",
                    "No parece que vaya a llegar muy lejos en combate"
                ],
                individual: [
                    "Están fuera de todo cálculo. ¡Es increíble!",
                    "Son realmente impresionantes",
                    "Están bastante bien",
                    "Dejan un poco que desear"
                ], 
                individualShort: [
                    "Están fuera de todo cálculo",
                    "Son realmente impresionantes",
                    "Están bastante bien",
                    "Dejan un poco que desear"
                ],
                size: [
                    
                ]
            },
            v: {
                overall: [
                    "Tu *%0* simplemente me fascina. ¡Puede lograr cualquier cosa!",
                    "Tu *%0* es muy fuerte. ¡Qué orgullo debes sentir!",
                    "Tu *%0* está bastante bien",
                    "Tu *%0* puede que no sea el mejor en combate, pero aun así me gusta"
                ],
                overallShort: [
                    "Simplemente me fascina",
                    "Es muy fuerte",
                    "Está bastante bien",
                    "Puede que no sea el mejor en combate"
                ],
                individual: [
                    "Estoy flipando con sus características. ¡Guau!",
                    "Cuenta con excelentes características. ¡Qué emocionante!",
                    "Sus características te ayudarán a cumplir tu objetivo en combate",
                    "Sus características no te serán de mucha utilidad en combate."
                ], 
                individualShort: [
                    "Estoy flipando con sus características",
                    "Cuenta con excelentes características",
                    "Te ayudarán a cumplir tu objetivo en combate",
                    "No te serán de mucha utilidad en combate."
                ],
                size: [
                    
                ]
            }
        },
        overallAppraisalPrompt: "Selecciona valoración general:",
        individualAppraisalPrompt: "Selecciona valoración individual:",
        statPrompt: "Selecciona la mejor característica:",
        result: `Los resultados para tu *%0*
IVs: *%1*
Características: *%2*/*%3*/*%4*`
    },
    fallback: {
        ivCalculator: {
            beautifiedOutput: "no ingresado"
        }
    }
}