import qltd from '../model/QLTuyenDung';
import bcrypt from 'bcrypt';

const getFormLogin = async (req, res) => {
    try {
        return res.render('login', { message: "" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while fetching the job.");
    }
};

const login = async (req, res) => {
    let {name, password} = req.body;
    if (!name || !password) {
        return res.status(400).render('login', {message: "Username and password are required!" });
    }
    try {
        const user = await qltd.Employees.findOne({ username: name });

        if (!user) {
            return res.status(400).render('login', {user, message: "Username is invalid!" });
        }

        console.log("username db:" , user.username);
        console.log("password db:" , user.password);

        console.log("username:" , name);
        console.log("password:" , password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);

        if (isMatch) {
            req.session.user = user;
            console.log("Session after login:", req.session);
            return res.redirect('/job/getjob');
        } else {
            return res.status(400).render('login', {user, message: "Password is incorrect!" });
        }
    } catch (error) {
        console.error(error)
        return res.status(500).render('login', {user, message: "Internal server error"});
    }
}

module.exports = {
    getFormLogin,
    login
};