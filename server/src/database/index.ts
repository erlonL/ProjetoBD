import { Sequelize, Model, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
});

class Aluno extends Model {}
Aluno.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    serie: {
        type: DataTypes.STRING,
        allowNull: false
    },
    matricula: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'alunos'
});

sequelize.sync();

async () => {
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    }
    catch(error: any){
        console.error('Unable to connect to the database:', error);
    }
}

export default Aluno;