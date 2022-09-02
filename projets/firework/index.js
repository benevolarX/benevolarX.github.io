const start = () => {
    const main = document.getElementById('root')
    main.classList.add('full', 'flex', 'ai-center', 'jc-center');
    document.body.classList.add('full-height', 'flex', 'ai-center', 'jc-center', 'txt-center');

    const firework = new Firework({
        opacity: 0.9,
        width: 1248,
        height: 768,
        speed: 100,
        max_rocket: 100,
        max_luminosite: 8,
        classNames: 'demo',
        sound: ['http://127.0.0.1:5500/assets/sound/prout.mp3']
    });
    if (main !== null) {
        firework.attach(main);
        firework.start();
    }
}

document.addEventListener('readystatechange', () => {
    const elem = (window.addEventListener) ? window : document;
    elem.addEventListener('load', start, false);
});
