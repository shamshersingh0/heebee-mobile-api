# heebee-backend
npm install
<!-- sequelize install command -->
npm install sequelize pg pg-hstore
npm install -g sequelize-cli
<!-- sequelize db create -->
sequelize db:create
<!-- sequelize table migrate command -->
sequelize db:migrate
<!-- sequelize model generate command -->
sequelize model:generate --name category --attributes catId:string,name:string