window.onload = () => {
    let main = document.createElement('main');
    main.classList.add('full', 'flex', 'ai-center', 'jc-center');
    document.body.appendChild(main);
    document.body.classList.add('full-height', 'flex', 'ai-center', 'jc-center', 'txt-center');

    const firework = new Firework({
        opacity: 0.9,
        width: 1400,
        height: 800,
        speed: 100,
        max_rocket: 100,
        max_luminosite: 10,
        classNames: 'demo'
    });
    if (main !== null) {
        firework.attach(main);
        firework.start();
    }
}
