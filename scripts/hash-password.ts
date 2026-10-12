import argon2 from "argon2";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npx tsx scripts/hash-password.ts <password>");
  process.exit(1);
}

argon2
  .hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  })
  .then((hash) => {
    console.log(hash);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
