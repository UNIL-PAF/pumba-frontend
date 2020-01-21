import React, {
    PureComponent,
} from 'react';
import { connect } from 'react-redux'
import {Button} from 'reactstrap'
import {showOptionsMenu} from "../../actions/menuActions";
import GelOptions from "./GelOptions"
import PropTypes from 'prop-types'
import ProteinOptions from "./ProteinOptions";

class PlotOptionsButton extends PureComponent {

    /**
     * Add the functionality to make the option window disappear when a mouse click outside is detected.
     * https://medium.com/@pitipatdop/little-neat-trick-to-capture-click-outside-react-component-5604830beb7f
     */

    constructor(props) {
        super(props)
        this.node = React.createRef()
    }

    componentWillMount(){
        document.addEventListener('mousedown', this.handleClick, false)
    }

    componentWillUnmount(){
        document.removeEventListener('mousedown', this.handleClick, false)
    }

    handleClick = (e) => {
        if(this.node.current.contains(e.target)){
            return
        }

        // the click was outside, so we remove the menu
        this.props.showOptionsMenu(undefined)
    }


    renderOptionsMenu = (pageName) => {
        switch(pageName) {
            case "lanes":
                return <GelOptions></GelOptions>
            case "graph":
                return <ProteinOptions/>
            default:
                return null
        }

    }

    render() {
        const {pathname, selectedOption, showOptionsMenu} = this.props

        const pageName = pathname.replace(/\/(\w+)/, '$1')
        const pagesWithOptions = ['lanes', 'graph']
        const showOptions = pagesWithOptions.includes(pageName)
        const cursor = showOptions ? 'pointer' : 'default'
        const pageOptionActive = selectedOption === pageName

        const callback = () => {
            if(!selectedOption){
                showOptionsMenu(pageName)
            }else{
                showOptionsMenu(undefined)
            }
        }

        return <div ref={this.node}>
            <Button id={'options-button'} color="primary" outline={true} disabled={! showOptions} onClick={() => callback()} style={{cursor: cursor}} active={pageOptionActive}>Options</Button>
            { pageOptionActive && this.renderOptionsMenu(pageName) }
        </div>
    }
}

PlotOptionsButton.propTypes = {
    showOptionsMenu: PropTypes.func.isRequired,
    pathname: PropTypes.string,
    selectedOption: PropTypes.string
};

const mapStateToProps = (state) => {
    const props = {
        pathname: state.router.location.pathname,
        selectedOption: state.menu.selectedOption
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        showOptionsMenu: (page) => { dispatch(showOptionsMenu(page)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlotOptionsButton);