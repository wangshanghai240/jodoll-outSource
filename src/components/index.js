import DragDialog from './DragDialog/index.vue'
import Calendar from './Calendar/index.vue'
import I18N from './I18N/index.vue'
import TableList from './Table/index.vue'
import FormSearch from './Form/index.vue'
import Pdf from './PDF/index.vue'
import Ckeditor from './Ckeditor/index.vue'
import Print from './Print/index.vue'

const components = [
    DragDialog,Calendar,I18N,TableList,FormSearch,Pdf,Ckeditor,Print
];

export const install = function(Vue, opts = {}) {
    components.forEach(component => {
		
      Vue.component('jod-' + component.name, component);
    });
};
