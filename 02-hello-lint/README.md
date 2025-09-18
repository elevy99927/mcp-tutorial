
## Hello Agent
1. we created new script in `package.json`:


```json
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix"
```


create "eslintrc.json" and ".eslintignore"

install linter:
```bash
npm install eslinter
```




3. run the following command:
```bash
npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Check lint
npm run lint:fix

#Fix lint
npm run lint:fix
```