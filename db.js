const Sequelize = require('sequelize')

const db = new Sequelize('nodejs', 'shikher', 'password', {
    dialect: 'sqlite',
    host: 'localhost',
    
    storage: './assignment.db'
})

const assign = db.define('URLS', {
   
    URL: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    count: {
        type: Sequelize.STRING,
        allowNull: true,
    }
	
})


db.sync().then(()=>console.log("data created")).catch((err)=>console.log("Database error"))



module.exports={
    assign
}