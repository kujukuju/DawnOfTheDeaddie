class InputManager {
    static KEY_W = 'w';
    static KEY_A = 'a';
    static KEY_S = 's';
    static KEY_D = 'd';
    static KEY_Q = 'q';
    static KEY_E = 'e';
    static KEY_SHIFT = 'shift';
    static KEY_LEFT = 'arrowleft';

    static _keys = {};
    static _mouseLeft = false;
    static _mouseRight = false;

    static _mousePosition = [0, 0];

    static initialize() {
        window.addEventListener('keydown', (event) => {
            InputManager._keys[event.key.toLowerCase()] = true;
        });
        window.addEventListener('keyup', (event) => {
            InputManager._keys[event.key.toLowerCase()] = false;
        });

        window.addEventListener('mousedown', (event) => {
            if (event.button === 0) {
                InputManager._mouseLeft = true;
            }
            if (event.button === 2) {
                InputManager._mouseRight = true;
            }
        });
        window.addEventListener('mouseup', (event) => {
            if (event.button === 0) {
                InputManager._mouseLeft = false;
            }
            if (event.button === 2) {
                InputManager._mouseRight = false;
            }
        });

        window.addEventListener('mousemove', (event) => {
            InputManager._mousePosition[0] = event.clientX;
            InputManager._mousePosition[1] = event.clientY;
        });

        window.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            return false;
        });
    }
}