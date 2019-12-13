import React, { Component } from 'react';
import TechItem from './TechItem';

class TechList extends Component {
    // static defaultProps = {
    //     tech: 'Oculto',
    // };
    
    // static propTypes = {
    //     tech: PropTypes.string,
    //     onDelete: PropTypes.func.isRequired,
    // };

    state = {
        newTech: '',
        techs: [],
    }

    // Função chamada após o componente ser construído/aparece na tela
    componentDidMount() {
        const techs = localStorage.getItem('techs');

        if (techs) {
            this.setState({ techs: JSON.parse(techs) });
        }
    }

    // Função chamada após o componente sofrer atualizações (alterações nas props ou estado/state)
    componentDidUpdate(prevProps, prevState) {
        if (prevState.techs !== this.state.tech) {
            localStorage.setItem('techs', JSON.stringify(this.state.techs));
        }
    }

    // Função chamada antes do componente ser destruído/removido
    componentWillUnmount() {

    }

    handleInputChange = e => {
        this.setState({ newTech: e.target.value });
    }

    handleSubmit = e => {
        e.preventDefault();

        this.setState({
            newTech: '',
            techs: [...this.state.techs, this.state.newTech],
        });
    }

    handleDelete = tech => {
        this.setState({ techs: this.state.techs.filter(t => t !== tech) });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <ul>
                    {this.state.techs.map(tech =>
                        <TechItem
                            key={tech}
                            tech={tech}
                            onDelete={() => this.handleDelete(tech)}
                        />
                    )}
                </ul>
                <input
                    type="text"
                    onChange={this.handleInputChange}
                    value={this.state.newTech}
                />
                <button type="submit">Enviar</button>
            </form>
        );
    }
}

export default TechList;
