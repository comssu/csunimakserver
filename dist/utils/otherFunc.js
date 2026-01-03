export const generateStrongPassword = (length = 8) => {
    if (length < 8)
        throw new Error("Password length must be at least 8 characters.");
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const special = "!_.";
    const allChars = upper + lower + digits + special;
    const getRandomChar = (chars) => chars[Math.floor(Math.random() * chars.length)];
    let password = [
        getRandomChar(upper),
        getRandomChar(lower),
        getRandomChar(digits),
        getRandomChar(special),
    ];
    while (password.length < length) {
        const nextChar = getRandomChar(allChars);
        const len = password.length;
        if (len >= 2 && password[len - 1] === nextChar && password[len - 2] === nextChar)
            continue;
        password.push(nextChar);
    }
    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];
    }
    return password.join("");
};
