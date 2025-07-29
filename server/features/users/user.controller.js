
import User from './user.model.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).populate('projects', 'title');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('projects');
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.profile.bio = req.body.bio ?? user.profile.bio;
      user.profile.location = req.body.location ?? user.profile.location;
      user.profile.avatarUrl = req.body.avatarUrl ?? user.profile.avatarUrl;
      user.profile.socialLinks.github = req.body.github ?? user.profile.socialLinks.github;
      user.profile.socialLinks.linkedin = req.body.linkedin ?? user.profile.socialLinks.linkedin;
      user.profile.socialLinks.website = req.body.website ?? user.profile.socialLinks.website;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: 'Query parameter "q" is required' });

        const users = await User.find(
            { $text: { $search: q } },
            { score: { $meta: 'textScore' } }
        ).sort({ score: { $meta: 'textScore' } });

        res.json(users);
    } catch (error) {
        next(error);
    }
};