import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {Alert} from 'reactstrap'
import LoadingSvgIcon from './common/loadingSvgIcon'

class PumbaNotifications extends Component {

    render(){
        const {proteinIsLoading} = this.props

        return (
            <div>
                {proteinIsLoading && <Alert className={"pumba-notification"} style={{position: "absolute"}}>
                    <LoadingSvgIcon iconHeight={20} iconWidth={20} hide={false}></LoadingSvgIcon> Loading ...
                </Alert>}
            </div>
        )
    }

}

PumbaNotifications.propTypes = {
    proteinIsLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
    const props = {
        proteinIsLoading : state.loadProtein.proteinIsLoading,
    }
    return props
}

export default connect(mapStateToProps, null)(PumbaNotifications)

