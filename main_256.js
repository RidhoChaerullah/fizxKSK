document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputplaintext');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const plaintext = document.getElementById('inputPlaintextUser').value.replace(/\s+/g, "");
        const caesarShift = parseInt(document.getElementById('caesarShift').value);
        const transpositionKey = parseInt(document.getElementById('transpositionKey').value);

        const caesarCiphertext = caesar_encrypt(plaintext, caesarShift);
        console.log("Ciphertext setelah Caesar Cipher:", caesarCiphertext);

        const [finalCiphertext, matrix] = transposition_encrypt(caesarCiphertext, transpositionKey);
        console.log("Ciphertext akhir setelah Transposisi:", finalCiphertext);

        print_matrix(matrix);

        const enkripsiList = document.getElementById('enkripsiPlaintextshelfList');
        const listItem = document.createElement('div');
        listItem.innerText = `Ciphertext: ${finalCiphertext}`;
        enkripsiList.appendChild(listItem);
    });

    const searchForm = document.getElementById('searchPesan');
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const ciphertext = document.getElementById('searchPlaintextUser').value;
        const caesarShift = parseInt(document.getElementById('caesarShiftDecrypt').value);
        const transpositionKey = parseInt(document.getElementById('transpositionKeyDecrypt').value);

        const intermediatePlaintext = transposition_decrypt(ciphertext, transpositionKey);
        console.log("Plaintext setelah dekripsi Transposisi:", intermediatePlaintext);

        const finalPlaintext = caesar_decrypt(intermediatePlaintext, caesarShift);
        console.log("Plaintext akhir setelah dekripsi Caesar Cipher:", finalPlaintext);

        const dekripsiList = document.getElementById('dekripsiPlaintextshelfList');
        const listItem = document.createElement('div');
        listItem.innerText = `Plaintext: ${finalPlaintext}`;
        dekripsiList.appendChild(listItem);
    });
});

function caesar_encrypt(plaintext, shift) {
    let encrypted = "";
    for (let char of plaintext) {
        const charCode = char.charCodeAt(0);
        const newCharCode = (charCode + shift) % 256;
        encrypted += String.fromCharCode(newCharCode);
    }
    return encrypted;
}

function caesar_decrypt(ciphertext, shift) {
    let decrypted = "";
    for (let char of ciphertext) {
        const charCode = char.charCodeAt(0);
        const newCharCode = (charCode - shift + 256) % 256;
        decrypted += String.fromCharCode(newCharCode);
    }
    return decrypted;
}

function create_matrix(text, num_cols) {
    const num_rows = Math.ceil(text.length / num_cols);
    const matrix = Array.from({ length: num_rows }, () => Array(num_cols).fill(''));
    text.split('').forEach((char, index) => {
        const row = Math.floor(index / num_cols);
        const col = index % num_cols;
        matrix[row][col] = char;
    });
    // Isi kosong dengan 'Z'
    for (let row = 0; row < num_rows; row++) {
        for (let col = 0; col < num_cols; col++) {
            if (matrix[row][col] === '') {
                matrix[row][col] = 'Z';
            }
        }
    }
    return matrix;
}

function transposition_encrypt(plaintext, num_cols) {
    const matrix = create_matrix(plaintext, num_cols);
    let ciphertext = '';
    for (let col = 0; col < num_cols; col++) {
        for (let row = 0; row < matrix.length; row++) {
            if (matrix[row][col] !== '') {
                ciphertext += matrix[row][col];
            }
        }
    }
    return [ciphertext, matrix];
}

function create_decryption_matrix(ciphertext, num_cols) {
    const num_rows = Math.ceil(ciphertext.length / num_cols);
    const matrix = Array.from({ length: num_rows }, () => Array(num_cols).fill(''));
    let k = 0;
    for (let col = 0; col < num_cols; col++) {
        for (let row = 0; row < num_rows; row++) {
            if (k < ciphertext.length) {
                matrix[row][col] = ciphertext[k++];
            }
        }
    }
    return matrix;
}

function transposition_decrypt(ciphertext, num_cols) {
    const matrix = create_decryption_matrix(ciphertext, num_cols);
    let plaintext = '';
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < num_cols; col++) {
            if (matrix[row][col] !== '') {
                plaintext += matrix[row][col];
            }
        }
    }
    return plaintext.replace(/Z+$/, ''); // Menghapus 'Z' yang ditambahkan sebagai padding
}

function print_matrix(matrix) {
    for (const row of matrix) {
        console.log(row.join(' '));
    }
}
