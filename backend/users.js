const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/User') // adjust path if needed
const router = express.Router()

const SECRET_KEY = 'your_secret_key' // use env variable in production

// ✅ Register route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  try {
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ error: 'User already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const user = new User({ name, email, password: hashed })
    await user.save()

    res.status(201).json({ message: 'Registered successfully' })
  } catch (err) {
    console.error('Register Error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ✅ Login route with name & email included
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: 'Invalid password' })

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' })

    // ✅ Send name + email so frontend can store it
    res.json({
      message: 'Login successful',
      token,
      name: user.name,
      email: user.email,
    })
  } catch (err) {
    console.error('Login Error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
