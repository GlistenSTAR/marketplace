import securePage from '../../hocs/securePage'
import Layout from 'components/Layout'
import AddInventory from "./add/index.js"

export default securePage(() => (
    <Layout title="Add Inventory">
        <AddInventory />
    </Layout>
))