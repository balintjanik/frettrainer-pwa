if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('portrait');
} else {
    console.warn('Screen orientation lock is not supported on this device.');
}