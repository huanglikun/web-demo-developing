<template>

    <el-upload
      class="upload-demo"
      accept="image/jpeg, image/png, image/jpg"
      :limit="2"
      :action="action"
      :headers="headers"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :on-error="onError"
      :on-exceed="onExceed"
      list-type="picture"
      style="width: 50%"
      drag
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text" v-if="fileBoolen">
        请将封面图片拖入或
        <em>点击上传</em>
      </div>
      <div class="el-upload__text" v-else>图片已上传</div>
      <div class="el-upload__text">默认为空</div>
      <div slot="tip" class="el-upload__tip" style="padding: 3px">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
</template>
<script>
import { getToken } from "../../../utils/auth";
export default {
  name: "ImgUpload",
  data() {
    return {
      ArticleAvatarUrl: "",
      action: `${process.env.VUE_APP_BASE_API}/article/avatar-upload`, // 图片上传接口
    };
  },
  computed: {
    // 获取 token
    headers() {
      return {
        Authorization: `Bearer ${getToken()}`,
      };
    },
    methods: {
      // 上传前
      beforeUpload(file) {
        this.$emit("beforeUpload", file);
      },
      // 上传成功
      onSuccess(res, file) {
        const { code, msg } = res;
        if (code === 0) {
          this.fileName = res.data;
          this.fileBoolen = false;
          this.Article.ArticleAvatar = res.data;
          this.$message({
            message: msg,
            type: "success",
          });
          this.$emit("onSuccess", file);
        } else {
          this.$message({
            message: (msg && `上传失败,原因:${msg}`) || "上传失败",
            type: "error",
          });
          this.$emit("onError", file);
        }
      },
      // 删除封面图触发的函数
      onRemove() {
        this.fileBoolen = !this.fileBoolen;
        this.$message({
          message: "封面图片删除成功",
          type: "success",
        });
        this.$emit("onRemove");
      },
      // 点击封面图触发的函数
      onPreview(file) {
        window.open(this.fileList.url);
      },
      onError(err) {
        const errMsg = (err.message && JSON.parse(err.message)) || "上传失败";
        this.$message({
          message:
            (errMsg.msg && `上传失败，失败原因：${errMsg.msg}`) || "上传失败",
          type: "error",
        });
        this.$emit("onError", err);
      },
      onExceed() {
        this.$message({
          message: "文章只能有一个封面",
          type: "waring",
        });
      },
    },
  },
};
</script>