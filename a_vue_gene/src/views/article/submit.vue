<template>
  <div class="submit">
    <el-form ref="Article" label-width="70px" :rules="rules" :model="Article">
      <h1>发布文章</h1>
      <el-form-item label="标题：" prop="ArticleTitle">
        <el-input
          type="text"
          v-model="Article.ArticleTitle"
          placeholder="请输入文章标题"
          clearable
          prefix-icon
          :maxlength="20"
          :show-word-limit="true"
          style="width:30%"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类：" prop="ArticleSort">
        <el-select
          v-model="Article.ArticleSort"
          placeholder="请选择文章分类"
          prefix-icon="el-icon-sort"
          :filterable="true"
          style="width: 30%"
        >
          <el-option v-for="item in options" :key="item.id" :label="item.sort" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="作者：" prop="ArticleAuthor">
        <el-input
          type="text"
          v-model="Article.ArticleAuthor"
          placeholder="请输入文章作者"
          clearable
          prefix-icon
          :maxlength="20"
          :show-word-limit="true"
          style="width:30%"
        ></el-input>
      </el-form-item>
      <el-form-item label="简介：" prop="ArticleOutline">
        <el-input
          type="textarea"
          placeholder="请输入文章简介"
          v-model="Article.ArticleOutline"
          clearable
          prefix-icon
          style="width:30%"
          maxlength="70"
          :rows="3"
        ></el-input>
      </el-form-item>
      <el-form-item style="width:30%" label="封面：" prop="ArticleAvatar">
        <ImgUpload></ImgUpload>
      </el-form-item>
      <el-form-item label="内容：" style="width:50%" prop="ArticleContent">
        <div>
          <edit v-model="Article.ArticleContent" :isClear="isClear" @change="change" class="edit"></edit>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button v-waves type="primary" plain @click="PublishButton">提交</el-button>
        <el-button @click="PublishClean('Article')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import edit from "../../componments_my/editor-edit";
import ImgUpload from "./submit/ImgUpload";
import { submitArticle, getSorts } from "@/api/article";
import waves from "@/directive/waves";
import axios from "axios";

const defaultArticle = {
  ArticleTitle: "",
  ArticleAuthor: "",
  ArticleSort: "",
  ArticleOutline: "",
  ArticleContent: "",
  ArticleAvatar: "",
};

export default {
  name: "pulishNav",
  directives: { waves },
  components: {
    edit,
    ImgUpload,
  },
  data() {
    return {
      isClear: false,
      ArticleAvatarUrl: "",
      ArticleJson: "",
      Article: {
        ArticleId:0,
        ArticleTitle: "", // 文章标题
        ArticleAuthor: "", // 文章作者
        ArticleSort: "", // 文章分类
        ArticleOutline: "", // 文章简介
        ArticleContent: "", // 文章内容
        ArticleAvatar: "", // 文章封面
      },
      options: [],
      fileName: "",
      fileBoolen: true,
      rules: {
        ArticleTitle: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 1 到 20 个字符", trigger: "blur" },
        ],
        ArticleSort: [
          { required: true, message: "请选择分类", trigger: "change" },
        ],
        ArticleContent: [
          { required: true, message: "请输入文章内容", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getSort();
  },
  methods: {
    change(val) {
      // console.log(this.Article.ArticleContent);
    },
    PublishButton() {
      this.$refs["Article"].validate((valid) => {
        if (valid) {
          submitArticle(this.Article);
        } else {
            this.$message({
              message: "文章信息不完整",
              type: "error",
            });
        }
      });
    },
    getSort() {
      getSorts().then((res) => {
        this.options = res.data;
      });
    },
    PublishClean(name) {
      this.$refs[name].resetFields();
    },
  },
};
</script>

<style scoped>
.submit {
  padding-left: 25px;
  background-color: #f2f6fc;
}
.el-upload-dragger {
  width: 180px !important;
  height: 90px;
}
.edit {
  margin: auto;
  width: 100%;
  height: 430px;
}
.el-row {
  margin-bottom: 20px;
}
span {
  font-size: 20px;
}
</style>