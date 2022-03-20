<!--
 * @FileDescription: 头部语言切换
 * @Author: wangpenghui
 * @Date: 2020/11/11
 * @LastEditors: wangpenghui
 * @LastEditTime: 2020/11/11
 -->
<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon class-name="international-icon" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language==='zh'" command="zh">
        中文
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'" command="en">
        English
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='es'" command="es">
        Español
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='ja'" command="ja">
        日本語
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('app/setLanguage', lang)
	  switch(lang){
		  case 'zh':
		  this.$message({
		    message: '切换语言成功',
		    type: 'success'
		  })
		  break;
		  case 'en':
		  this.$message({
		    message: 'Switch Language Success',
		    type: 'success'
		  })
		  break;
		  case 'es':
		  this.$message({
		    message: 'Cambio de idioma',
		    type: 'success'
		  })
		  break;
		  case 'ja':
		  this.$message({
		    message: '言語切り替え成功',
		    type: 'success'
		  })
		  break;
	  }
      
    }
  }
}
</script>
