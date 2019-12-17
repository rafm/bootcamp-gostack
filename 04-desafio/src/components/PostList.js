import React, { Component } from 'react';
import './PostList.css';
import Post from './Post';

class PostList extends Component {
    state = {
        posts: [],
    }

    componentDidMount() {
        this.setState({
            posts: [
                {
                    id: 1,
                    author: {
                        name: "Julio Alcantara",
                        avatar: "http://url-da-imagem.com/imagem.jpg",
                    },
                    date: "04 Jun 2019",
                    content: "Pessoal, alguém sabe se a Rocketseat está contratando?",
                    comments: [
                        {
                            id: 1,
                            author: {
                                name: "Diego Fernandes",
                                avatar: "http://url-da-imagem.com/imagem.jpg",
                            },
                            content: "Conteúdo do comentário",
                        },
                    ],
                },
            ],
        });
    }

    render() {
        const { posts } = this.state;

        return (
            <main>
                {posts.map(post => <Post key={post.id} data={post} />)}
            </main>
        );
    }
}

export default PostList;
