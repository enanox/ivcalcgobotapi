# IVCalcGoAPI + Bots

Appraisal API for PokémonGo. 

Perform IV valorations offline without hitting the Niantic API (thus playing along with the ToS).

Client apps provided are Telegram and Discord bots.

## Install

Note: so far, the MVP is not available yet.
- `git fetch dev && git checkout dev`
- `npm install`
- If you are interested in hosting a bot mirror for Telegram, contact me and I'll kindly provide the token for you.
    - `node telegram-bot/index`

## WIP

- Telegram bot: 
    - Talk to `@IVCalcGoBot` on Telegram.
        - `/start/` - Gives usage information
        - `/support` - Support message
        - `/echo <message>` - Repeat message
        - `/iv <name> cp:<number> hp:<number> s:<number> c:<number>` - Perform calculations on the input Pokémon
            - `<name>` - Pokémon name
            - `cp` - Combat points
            - `hp` - Health points
            - `s` - Stardust to power up
            - `c` - Candies to power up
    - [x] Fix test easter eggs
        - Localized easter eggs
    - [ ] Appraisal
        - [x] From Team Leader appraisal
        - [ ] Using straight formula based on input data
    - [x] Add analytics tracking from AppMetrica (Yandex)
- Discord bot:
    - [ ] Create bot
    - [ ] Appraisal
- API
    - [ ] Create API
    - [ ] Calculations
        - [x] First version using Team Leader appraisal
    - [ ] Image processing