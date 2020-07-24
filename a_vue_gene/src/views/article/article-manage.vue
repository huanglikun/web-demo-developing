<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="文章名"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-input
        v-model="listQuery.author"
        placeholder="作者"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-select
        v-model="listQuery.sort"
        placeholder="分类"
        clearable
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.id"
          :label="item.sort"
          :value="item.sort"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left: 10px"
        @click="handleFilter"
      >查询</el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        style="margin-left: 5px"
        @click="handleCreate"
      >新增</el-button>
      <el-checkbox
        v-model="showCover"
        class="filter-item"
        style="margin-left: 5px"
        @change="changeShowCover"
      >显示封面</el-checkbox>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80"></el-table-column>
      <el-table-column label="文章名" prop="title" width="150" align="center" sortable="custom">
        <template slot-scope="{ row: { titleWrapper }}">
          <span v-html="titleWrapper" />
        </template>
      </el-table-column>
      <el-table-column label="作者" width="150" align="center">
        <template slot-scope="{ row: { authorWrapper }}">
          <span v-html="authorWrapper" />
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="sort" align="center" width="200"></el-table-column>
      <el-table-column v-if="showCover" label="封面" width="150" align="center">
        <template slot-scope="{ row :{ avatar }}">
          <a :href="avatar" target="_blank">
            <img :src="avatar" style="width:60px;height:90px" />
          </a>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" prop="pubtime" sortable="custom" align="center" width="200">
        <template slot-scope="{ row: {pubtime}}">
          <span>{{pubtime | valueFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签" prop="label" align="center" width="200">
        <template slot-scope="{ row: {label}}">
          <span>{{label | valueFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="概要" prop="outline" align="center" width="200">
        <template slot-scope="{ row: {outline}}">
          <span>{{outline | valueFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="星标" prop="star" align="center" width="200">
        <template slot-scope="{ row: {star}}">
          <span>{{star | valueFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(row)" />
          <el-button
            type="text"
            icon="el-icon-delete"
            style="color:#f56c6c"
            @click="handleDelete(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="ArticleNum>0"
      :total="ArticleNum"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination/index";
import waves from "../../directive/waves/waves";
import { getSorts, getArticleList,deleteArticle } from "@/api/article";
export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    valueFilter(value) {
      return value || "无";
    }
  },
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      listQuery: {},
      showCover: true,
      categoryList: [],
      list: [],
      ArticleNum: 0
    };
  },
  created() {
    this.parseQuery();
  },
  mounted() {
    this.getCategoryList(); // 获取分类
    this.getList(); // 获取分类
  },
  methods: {
    parseQuery() {
      const listQuery = {
        page: 1, // 页码
        pageSize: 10, // 每页数据数
        order: "+id" // 排序规则
      };
      this.listQuery = { ...listQuery, ...this.listQuery };
    },
    getCategoryList() {
      getSorts().then(res => {
        this.categoryList = res.data;
      });
    },
    getList() {
      this.listLoading = true;
      getArticleList(this.listQuery).then(res => {
        const { list, count } = res.data;
        this.list = list;
        this.ArticleNum = count;
        this.listLoading = false;
        console.log(this.list);
        this.list.forEach(article => {
          //将搜索关键字高亮显示
          article.titleWrapper = this.wrapperKeyword("title", article.title);
          article.authorWrapper = this.wrapperKeyword("author", article.author);
        });
      });
    },
    wrapperKeyword(k, v) {
      function highlight(value) {
        return `<span style="color: #1890ff">${value}</span>`;
      }
      if (!this.listQuery[k]) {
        return v;
      } else {
        return v.replace(new RegExp(this.listQuery[k], "ig"), v =>
          highlight(v)
        );
      }
    },
    changeShowCover(value) {
      // 是否显示封面
      this.showCover = value;
    },
    sortChange(data) {
      console.log("sortChange", data);
      const { prop, order } = data;
      if (order === "ascending") {
        this.listQuery.order = `+${prop}`;
      } else {
        this.listQuery.order = `-${prop}`;
      }
      this.handleFilter();
    },
    handleFilter() {
      // console.log("handleFilter", this.listQuery);
      this.getList();
    },
    handleCreate() {
      // console.log("handleCreate");
      this.$router.push('/article/submit')
    },
    handleUpdate(row) {
      // console.log("handleUpdate", row);
    },
    handleDelete(row){
      console.log("handleDelete", row);
      this.$confirm('此操作将永久删除文章,是否继续?','提示',{
        confirmButtonText: '确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(() => {
        deleteArticle(row.id).then(res => {
          this.$notify({
            title: '成功',
            message: res.msg || '删除成功',
            type:'success',
            duration: 2000
          })
          this.handleFilter()
        })
      })
    }
  }
};
</script>