import FormModal from "./FormModal.vue"
import UiForm from "./UiForm.vue"
import UiPage from "./UiPage.vue"
import SearchForm from "./SearchForm.vue"
import UiBtn from "./UiBtn.vue"
import UiTable from "./UiTable.vue"
import SvgIcon from "./SvgIcon/index.vue"
export default {
  install(app){
    app.component("FormModal",FormModal)
    app.component("UiForm",UiForm)
    app.component("UiPage",UiPage)
    app.component("SearchForm",SearchForm)
    app.component("UiBtn",UiBtn)
    app.component("UiTable",UiTable)
    app.component("SvgIcon",SvgIcon)
  }
}