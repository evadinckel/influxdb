// Libraries
import React, {PureComponent} from 'react'
import _ from 'lodash'

// Components
import {Spinner} from 'src/clockface'
import {ErrorHandling} from 'src/shared/decorators/errors'

// Apis
import {client} from 'src/utils/api'

// types
import {RemoteDataState} from 'src/types'

export interface Props {
  bucket: string
  username: string
  children: (authToken: string) => JSX.Element
}

interface State {
  loading: RemoteDataState
  authToken?: string
}

@ErrorHandling
class FetchAuthToken extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {loading: RemoteDataState.NotStarted}
  }

  public async componentDidMount() {
    const {username} = this.props

    this.setState({loading: RemoteDataState.Loading})
    const authToken = await client.authorizations.getAuthorizationToken(
      username
    )

    this.setState({authToken, loading: RemoteDataState.Done})
  }

  public render() {
    return (
      <Spinner loading={this.state.loading}>
        {this.props.children(this.state.authToken)}
      </Spinner>
    )
  }
}

export default FetchAuthToken
