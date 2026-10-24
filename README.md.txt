1# creating Better-auth collections and create the first admin

in a raw project where there is no collections created yet
better auth creates its own collections for it to work
but since there is no collections in an empty project it will create a mess
to force creation of better auth collections go to the project root directory where package.json exist
 
in the root of the project

npx auth@latest create-admin

password must be 8 charchters or more

if your auth config is inside a src/lib folder
npx auth@latest create-admin --config ./src/lib/auth.ts
