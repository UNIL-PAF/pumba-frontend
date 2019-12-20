import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {Alert} from 'reactstrap'
import LoadingSvgIcon from './common/loadingSvgIcon'

class PumbaNotifications extends Component {

    render(){
        const {proteinIsLoading, error} = this.props

        return (
            <div>
                {proteinIsLoading && <Alert color="primary" className={"pumba-notification loading"} style={{position: "absolute"}}>
                    <LoadingSvgIcon iconHeight={20} iconWidth={20} hide={false}></LoadingSvgIcon> Loading ...
                </Alert>}
                {error && <Alert color="danger" className={"pumba-notification error"} style={{position: "absolute"}}>
                    {error}
                </Alert>}
            </div>
        )
    }

}

PumbaNotifications.propTypes = {
    proteinIsLoading: PropTypes.bool.isRequired,
    error: PropTypes.string
};

const mapStateToProps = (state) => {
    const props = {
        proteinIsLoading : state.loadProtein.proteinIsLoading,
        error: state.loadProtein.error
    }
    return props
}

export default connect(mapStateToProps, null)(PumbaNotifications)

