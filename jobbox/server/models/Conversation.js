const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;
