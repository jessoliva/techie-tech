// file connects to api/index.js

const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// NEED TO ADD WITH AUTHORIZATION

// GET all posts /api/posts
router.get('/', (req, res) => {
    // use this same query to populate the homepage template in home-routes.js
    Post.findAll({ // this is the query
        attributes: [
            'id',
            'content',
            'title',
            'created_at'
        ],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                } // include the User model itself so it can attach the username to the comment
            },
            {
                model: User,
                attributes: ['username']
            }
            //  post relationship with comment
            // post relationship with user
            // comment relationship with user 
        ]
    })
    .then(dbPostData => res.json(dbPostData)) 
    .catch(err => res.status(500).json(err));
});

// GET a single post /api/posts/:id
router.get('/:id', (req, res) => {

    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'content',
            'title',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => res.status(500).json(err));
});

// POST a post /api/posts
router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id
    })
    .then(dbUserData => {
        res.json(dbUserData)})
    .catch(err => res.status(500).json(err));
});

// PUT a post /api/posts/:id
router.put('/:id', withAuth, (req, res) => {
    Post.update(
        {
            title: req.body.title,
            content: req.body.content,
            created_at: req.body.created_at
        },
        {
            where: {
            id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
         res.json(dbPostData);
    })
    .catch(err => res.status(500).json(err));
});

router.delete('/:id', withAuth, (req, res) => {
    console.log('id', req.params.id);
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }

        res.json(dbPostData);
    })
    .catch(err => res.status(500).json(err));
});

module.exports = router;
