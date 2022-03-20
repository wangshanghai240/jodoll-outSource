import waves from '@/directive/waves/index.js'
import drag from '@/directive/el-drag-dialog/index.js'
import vhas from '@/directive/vhas/index.js'

const dir = [
	waves,drag,vhas
]

export const directive = function(Vue, opts = {}) {
    dir.forEach(dir => {
      Vue.use(dir);
    });
};