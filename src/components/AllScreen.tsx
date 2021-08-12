import * as React from 'react'
import { SafeAreaView, Text, ScrollView, View, StyleSheet, RefreshControl, Platform, TextInput, TouchableOpacity, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Fab, Spinner, Icon, Item } from 'native-base'
import Feather from 'react-native-vector-icons/Feather'
import { Card } from '@ui-kitten/components'
import _ from 'lodash'
import DefaultPreference from 'react-native-default-preference'

import { getAllCases, getAllCountriesCases, getCountriesCases } from '../redux/actions/covidAction'
import { setConnection } from '../redux/actions/informationAction'
import { danger, warning, basic, success, black, blackSecondary, disabled, white, primary, } from '../Lib/Color'
import { dynamicSort } from '../Lib/Lib';
import NoInternet from './NoInternet'

interface AllScreenProps {
  covid?: any,

  navigation: any,
  getAllCases: any,
  getAllCountriesCases: any,
  getCountriesCases: any
}

interface AllScreenState {
  refreshing: boolean,
  pinnedCountry?: string,
  filteredListItem?: [],
  searchText?: string,
  alert: boolean,
  active: boolean
}

let sort = 'desc'

class AllScreen extends React.Component<AllScreenProps, AllScreenState> {

  private myRef: any
  constructor(props: AllScreenProps, state: AllScreenState) {
    super(props)
    this.state = {
      refreshing: state.refreshing,
      pinnedCountry: state.pinnedCountry,
      filteredListItem: state.filteredListItem,
      searchText: state.searchText,
      alert: state.alert,
      active: state.active
    }

    this.myRef = React.createRef()
  }

  componentDidMount(): void {
    const { getAllCases, getAllCountriesCases, setConnection }: any = this.props

    this.getPreference()
    setConnection()
    getAllCases()
    getAllCountriesCases()

    this.setState({ refreshing: false, active: false })
  }

  getPreference(): void {
    DefaultPreference.get('pinned').then((res) => {
      this.setState({ pinnedCountry: res })
    }).catch((err) => {
      throw err
    })
  }

  componentDidUpdate(prevProps: any, prevState: any): void {
    if (this.state.pinnedCountry !== prevState.pinnedCountry) {
      if (!_.isEmpty(this.state.pinnedCountry)) this.props.getCountriesCases(this.state.pinnedCountry)
    }
  }

  onRefresh(): void {
    const { getAllCases, getAllCountriesCases, setConnection }: any = this.props

    this.getPreference()
    setConnection()
    getAllCases()
    getAllCountriesCases()

    this.setState({ refreshing: false })
  }

  formatNumber(num: number): String {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  }

  setDefaultPreference(dataPreference: string): void {
    DefaultPreference.set('pinned', dataPreference).then((res) => {
      DefaultPreference.get('pinned').then((res) => {
        this.setState({ pinnedCountry: res })
      }).catch((err) => {
        throw err
      })
    }).catch((err) => {
      throw err
    })
  }

  onSearchTextChange = (searchText: string) => {
    const { listAllCountriesCases } = this.props.covid

    let filtered = _.filter(listAllCountriesCases, (item: any) => {
      return item.country.toLowerCase().includes(searchText.toLowerCase())
    })

    if (_.isEmpty(searchText)) {
      filtered = null
    }

    this.setState({ searchText, filteredListItem: filtered })
  }

  renderItemGlobal(item: number, header: string): Object {
    let statusHeader = header == 'Positif' ? black : header == 'Meninggal' ? danger : success

    return (
      <Card style={{ marginRight: 8, width: 200 }}>
        {/* Status Header */}
        <View style={[styles.statusHeader, { backgroundColor: statusHeader }]} />

        {/* Header */}
        <Text style={[styles.textDetail, { marginBottom: -4 }]}>Kasus</Text>
        <Text style={styles.textTitle}>{header}</Text>
        {/* Divider */}
        <View style={styles.divider} />

        {/* Content */}
        <Text style={[styles.textDetail, { fontFamily: 'Poppins-Medium' }]}>{this.formatNumber(item || 0)}</Text>
      </Card>
    )
  }

  renderItemPinned(item: any): Object {
    let statusHeader = item.cases >= 1000 ? danger : item.cases >= 500 ? warning : item.cases <= 100 ? basic : success

    return (
      <Card style={{ marginVertical: 8, marginHorizontal: 16 }}>
        {/* Status Header */}
        <View style={[styles.statusHeader, { backgroundColor: statusHeader }]} />

        {/* Header */}
        <View style={[styles.row, { alignItems: 'flex-end', justifyContent: 'space-between' }]}>
          <Text style={styles.textTitle}>{item.country}</Text>
          <TouchableOpacity
            onPress={() => this.setDefaultPreference('')}
            style={{ alignSelf: 'center' }}>
            <Icon type='AntDesign' name={'pushpin'} style={{ fontSize: 24, transform: [{ rotate: '90deg' }] }} />
          </TouchableOpacity>
        </View>
        {/* Divider */}
        <View style={styles.divider} />

        {/* Content */}
        <View style={[styles.column, { marginVertical: 8 }]}>
          <Text style={styles.textDetail}>{`Kasus hari ini: ${this.formatNumber(item.todayCases || 0)}`}</Text>
          <Text style={styles.textDetail}>{`Kematian hari ini: ${this.formatNumber(item.todayDeaths || 0)}`}</Text>
        </View>
        <View style={[styles.column, { marginVertical: 8 }]}>
          <Text style={styles.textDetail}>{`Total kasus: ${this.formatNumber(item.cases || 0)}`}</Text>
          <Text style={styles.textDetail}>{`Total kematian: ${this.formatNumber(item.deaths || 0)}`}</Text>
          <Text style={styles.textDetail}>{`Total positif: ${this.formatNumber(item.active || 0)}`}</Text>
        </View>
        <View style={[styles.column, { marginVertical: 8 }]}>
          <Text style={styles.textDetail}>{`Angka sembuh: ${this.formatNumber(item.recovered || 0)}`}</Text>
          <Text style={styles.textDetail}>{`Kondisi kritis: ${this.formatNumber(item.critical || 0)}`}</Text>
        </View>
      </Card>
    )
  }

  renderItem(item: any, index: number): any {
    let statusHeader = item.cases >= 1000 ? danger : item.cases >= 500 ? warning : item.cases <= 100 ? basic : success

    const pinned = this.state.pinnedCountry == item.country ? 'pushpin' : 'pushpino'
    const setPreference = !_.isEmpty(this.state.pinnedCountry) ? '' : item.country

    return (
      <Card key={index} style={{ marginVertical: 8, marginHorizontal: 16 }}>
        {/* Status Header */}
        <View style={[styles.statusHeader, { backgroundColor: statusHeader }]} />

        {/* Header */}
        <View style={[styles.row, { alignItems: 'flex-end', justifyContent: 'space-between' }]}>
          <View style={styles.column}>
            <Text style={[styles.textTitle, { fontSize: 16 }]}>{`# ${index + 1}`}</Text>
            <Text style={styles.textTitle}>{item.country}</Text>
          </View>
          <TouchableOpacity
            onPress={() => this.setDefaultPreference(setPreference)}
            style={{ alignSelf: 'center' }}>
            <Icon type='AntDesign' name={pinned} style={{ fontSize: 24, transform: [{ rotate: '90deg' }] }} />
          </TouchableOpacity>
        </View>
        {/* Divider */}
        <View style={styles.divider} />

        {/* Content */}
        <View style={[styles.column, { marginVertical: 8 }]}>
          <Text style={styles.textDetail}>{`Kasus hari ini: ${this.formatNumber(item.todayCases || 0)}`}</Text>
          <Text style={styles.textDetail}>{`Kematian hari ini: ${this.formatNumber(item.todayDeaths || 0)}`}</Text>
        </View>
        <View style={[styles.column, { marginVertical: 8 }]}>
          <Text style={styles.textDetail}>{`Total kasus: ${this.formatNumber(item.cases || 0)}`}</Text>
          <Text style={styles.textDetail}>{`Total kematian: ${this.formatNumber(item.deaths || 0)}`}</Text>
          <Text style={styles.textDetail}>{`Total positif: ${this.formatNumber(item.active || 0)}`}</Text>
        </View>
        <View style={[styles.column, { marginVertical: 8 }]}>
          <Text style={styles.textDetail}>{`Angka sembuh: ${this.formatNumber(item.recovered || 0)}`}</Text>
          <Text style={styles.textDetail}>{`Kondisi kritis: ${this.formatNumber(item.critical || 0)}`}</Text>
        </View>
      </Card>
    )
  }

  renderSearch(searchText: string): Object {
    return (
      <Item style={styles.searchContainer}>
        <Feather name='search' size={20} color={'#bdbdbd'} />
        <TextInput
          style={styles.textInput}
          placeholder={'Cari negara . . .'}
          placeholderTextColor={'#bdbdbd'}
          value={searchText}
          onChangeText={(text) => this.onSearchTextChange(text)} />
        {!_.isEmpty(searchText) && (
          <TouchableOpacity onPress={() => this.setState({ searchText: '' })}>
            <Feather name='x' size={20} color={'#bdbdbd'} />
          </TouchableOpacity>
        )}
      </Item>
    )
  }

  renderListGlobal(listAllCases: any): Object {
    return (
      <>
        <ScrollView
          contentContainerStyle={{ flexDirection: 'row', paddingHorizontal: 16 }}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {this.renderItemGlobal(listAllCases.cases, 'Positif')}
          {this.renderItemGlobal(listAllCases.deaths, 'Meninggal')}
          {this.renderItemGlobal(listAllCases.recovered, 'Sembuh')}
        </ScrollView>
      </>
    )
  }

  renderListPinned(listCountriesCases: any): Object {
    return (
      <>
        <Text style={[styles.textHero, { marginTop: 8 }]}>
          Negara yang di pin
        </Text>
        {this.renderItemPinned(listCountriesCases)}
      </>
    )
  }

  renderItems = ({ item, index }) => this.renderItem(item, index)

  renderListCountry(filterListItem: []): Object {
    return (
      <>
        <Text style={[styles.textHero, { marginTop: 8 }]}>
          Semua negara
        </Text>
        <FlatList
          initialNumToRender={5}
          windowSize={10}
          maxToRenderPerBatch={10}
          contentContainerStyle={{ paddingBottom: 48 }}
          data={filterListItem}
          renderItem={this.renderItems} />
      </>
    )
  }

  renderLoading(): Object {
    return (
      <View style={styles.spinner}>
        <Spinner color={black} size={44} />
      </View>
    )
  }

  renderFloatingButton(): Object {
    return (
      <Fab
        active={this.state.active}
        direction="up"
        style={{ backgroundColor: black }}
        position="bottomRight"
        onPress={() => this.setState({ active: !this.state.active })}>
        <Icon type='AntDesign' name={'ellipsis1'} style={{ fontSize: 24 }} />
        <TouchableOpacity style={styles.indonesiaFlag} onPress={() => this.props.navigation.navigate('Webview', { headerText: 'Indonesia', uri: 'https://tracker-19.vercel.app/indonesia?header=0' })}>
          <Icon type='AntDesign' name={'flag'} style={{ fontSize: 16 }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkupPage} onPress={() => this.props.navigation.navigate('Webview', { headerText: 'Checkup', uri: 'https://tracker-19.vercel.app/checkup?header=0' })}>
          <Icon type='AntDesign' name={'form'} style={{ fontSize: 16 }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.scrollToTop} onPress={() => this.scrollToTop()}>
          <Feather name='chevrons-up' style={{ color: white, fontSize: 20 }} />
        </TouchableOpacity>
      </Fab>
    )
  }

  scrollToTop(): void {
    this.myRef.current.scrollTo({ x: 0, y: 0, animated: true })
  }

  renderData(): Object {
    const { listAllCases, listAllCountriesCases, listCountriesCases, loadingAllCases, loadingAllCountriesCases, loadingCountriesCases } = this.props.covid
    const { refreshing, pinnedCountry, searchText, filteredListItem } = this.state

    let listCountries: any = []

    if (!_.isEmpty(listAllCountriesCases)) listCountries = listAllCountriesCases.sort(dynamicSort('cases', sort))

    const filterListItem = _.isEmpty(searchText) ? listCountries : filteredListItem

    if (!loadingAllCases && listAllCases) {
      return (
        <>
          {this.renderSearch(searchText)}
          <ScrollView
            ref={this.myRef}
            refreshControl={<RefreshControl onRefresh={() => this.onRefresh()} refreshing={refreshing} />}>
            <Text style={styles.textHero}>Perkembangan virus COVID-19 tingkat global</Text>
            {this.renderListGlobal(listAllCases)}
            {!loadingCountriesCases && listCountriesCases && pinnedCountry !== '' ? (
              this.renderListPinned(listCountriesCases)
            ) : loadingCountriesCases && !listCountriesCases ? this.renderLoading() : null}
            {!loadingAllCountriesCases && listAllCountriesCases !== '' ? (
              this.renderListCountry(filterListItem)
            ) : this.renderLoading()}
          </ScrollView>
          {this.renderFloatingButton()}
        </>
      )
    }
    else {
      return this.renderLoading()
    }
  }

  render(): Object {
    const { info }: any = this.props

    if (!info.status) return <NoInternet onPress={() => this.onRefresh()} />
    else return (
      <>
        <SafeAreaView style={styles.container}>
          {this.renderData()}
        </SafeAreaView>
      </>
    )
  }
}

//ini buat style halaman yang ditampilin (?)
const styles = StyleSheet.create({
  container: {
    backgroundColor: white,
    flex: 1,
  },
  spinner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusHeader: {
    height: 6,
    marginHorizontal: -32,
    top: -16
  },
  divider: {
    backgroundColor: disabled,
    height: 2,
    marginHorizontal: -32,
    marginVertical: 16
  },
  textTitle: {
    color: black,
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    fontWeight: '800',
  },
  textDetail: {
    color: blackSecondary,
    fontFamily: 'Poppins-Light',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row'
  },
  column: {
    flexDirection: 'column'
  },
  textHero: {
    color: black,
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    padding: 16,
  },
  textHeroOrange: {
    color: primary,
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    padding: 16,
  },
  textInput: {
    color: black,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  scrollToTop: {
    backgroundColor: blackSecondary,
    padding: 8,
    borderRadius: 32
  },
  indonesiaFlag: {
    backgroundColor: primary,
    padding: 8,
    borderRadius: 32
  },
  checkupPage: {
    backgroundColor: black,
    padding: 8,
    borderRadius: 32
  }
})

const mapStateToProps = (state: any) => ({
  covid: state.covid,
  info: state.info,
})

const mapDispatchToProps = (dispatch) => {
  return {
    setConnection: bindActionCreators(setConnection, dispatch),
    getAllCases: bindActionCreators(getAllCases, dispatch),
    getAllCountriesCases: bindActionCreators(getAllCountriesCases, dispatch),
    getCountriesCases: bindActionCreators(getCountriesCases, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllScreen)