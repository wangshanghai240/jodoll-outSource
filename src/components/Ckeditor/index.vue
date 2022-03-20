<template>
  <div>
    <textarea :id="id"></textarea>
  </div>
</template>

<script>
  export default {
    name: 'ckeditor',
    props: [
      'value'
    ],
    mounted: function () {
      const self = this
      let token = this.$store.state.token
      let api = this.api.local
      // 渲染编辑器
      self.ckeditor = window.CKEDITOR.replace(self.id, {
        // eslint-disable-next-line
        toolbarGroups: [
			{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
			{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
			{ name: 'forms', groups: [ 'forms' ] },
			{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
			{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
			{ name: 'links', groups: [ 'links' ] },
			{ name: 'insert', groups: [ 'insert' ] },
			'/',
			{ name: 'styles', groups: [ 'styles' ] },
			{ name: 'colors', groups: [ 'colors' ] },
			{ name: 'tools', groups: [ 'tools' ] },
			{ name: 'others', groups: [ 'others' ] },
			{ name: 'about', groups: [ 'about' ] }
        ],
        // eslint-disable-next-line
        removeButtons: 'Source,Save,NewPage,ExportPdf,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Replace,SelectAll,Find,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CopyFormatting,RemoveFormat,NumberedList,BulletedList,Outdent,Indent,CreateDiv,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Image,Flash,Smiley,Iframe,ShowBlocks,About,BGColor'
      })
      // 设置初始内容
      self.ckeditor.setData(self.value)

      // 监听内容变更事件
      self.ckeditor.on('change', function () {
        self.$emit('input', self.ckeditor.getData())
      })
      

    },
    data: function () {
      return {
        id: parseInt(Math.random() * 10000).toString(),
        ckeditor: null
      }
    },
    watch: {
      // 监听prop的变化，更新ckeditor中的值
      value: function () {
        if (this.value !== this.ckeditor.getData()) {
          this.ckeditor.setData(this.value)
        }
      }
    },
    // 销毁组件前，销毁编辑器
    beforeDestroy: function () {
      if(self.ckeditor){//判断是否已经销毁
        self.ckeditor.destroy()
      }
    }
  }
</script>