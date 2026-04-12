/**
 * Password Hash Generator for Saudi Tabreed Portal
 *
 * Usage:
 *   node server/database/generate-password.cjs YourNewPassword
 *
 * Then copy the output hash into the SQL UPDATE statement:
 *   UPDATE Users SET PasswordHash = '<hash>' WHERE Email = 'admin@sauditabreed.com';
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.log('Usage: node server/database/generate-password.cjs <new-password>');
  console.log('');
  console.log('Example:');
  console.log('  node server/database/generate-password.cjs MySecure@Pass123');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);

console.log('');
console.log('Password:', password);
console.log('Bcrypt Hash:', hash);
console.log('');
console.log('-- SQL to update Admin password:');
console.log(`UPDATE Users SET PasswordHash = '${hash}', UpdatedAt = GETUTCDATE() WHERE Email = 'admin@sauditabreed.com';`);
console.log('');
console.log('-- SQL to update Editor password:');
console.log(`UPDATE Users SET PasswordHash = '${hash}', UpdatedAt = GETUTCDATE() WHERE Email = 'ahmed.qahtani@sauditabreed.com';`);
console.log('');
console.log('-- SQL to update User password:');
console.log(`UPDATE Users SET PasswordHash = '${hash}', UpdatedAt = GETUTCDATE() WHERE Email = 'sara.malik@sauditabreed.com';`);
