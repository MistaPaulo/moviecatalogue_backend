import bcrypt from 'bcryptjs';
import jwt    from 'jsonwebtoken';
import User   from '../models/user.model.js';
import Session from '../models/session.model.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email já em uso' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await new User({ name, email, password: hashed }).save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    // cria sessão (não haverá conflito pois é novo user)
    await new Session({ user_id: user._id, jwt: token }).save();

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    // remove sessões antigas para não violar o índice único
    await Session.deleteMany({ user_id: user._id });
    await new Session({ user_id: user._id, jwt: token }).save();

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) {
      const token = auth.split(' ')[1];
      // opcionalmente pode filtrar também por user_id: req.user.id
      await Session.deleteOne({ jwt: token });
    }
    res.json({ message: 'Logout efetuado' });
  } catch (err) {
    next(err);
  }
};
