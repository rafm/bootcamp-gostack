import React, { Component } from 'react';
import './Post.css';

class Post extends Component {

    render() {
        const { data } = this.props;

        return (
            <div className="post-container">
                <img alt="Post's author profile image" src={data.author.avatar} />
                { data.content }
            </div>
        );
    }
}

export default Post;
