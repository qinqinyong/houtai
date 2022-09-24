<template>
    <!-- 添加spu或修改spu -->
    <div>
        <!-- label-width放在el-form身上使所有label-width都是100px -->
        <el-form :model="spuForm" label-width="100px">

            <el-form-item label="SPU名称">
                <el-input v-model="spuForm.spuName" placeholder="SPU名称"></el-input>
            </el-form-item>

            <!--select的v-model实际收集的是option的value值 -->
            <el-form-item label="品牌">
                <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
                    <el-option :label="trademark.tmName" :value="trademark.id"
                        v-for="(trademark, index) in trademarkList" :key='trademark.id'>
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="SPU描述">                                         
                <el-input v-model="spuForm.description" placeholder="SPU描述" type="textarea" rows="3"></el-input>
            </el-form-item>
 
            <el-form-item label="上传图片">
                <!--展示图片   :file-list="xxx" 上传的文件列表,必须有name和url两个属性
                  例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}] 
                   上传成功的回调:on-success="handleSuccess" 新添加的，官网粘贴过来只有on-remove-->
                <el-upload  list-type="picture-card"  :file-list="spuImageList"
                    action="/dev-api/admin/product/fileUpload" 
                    :on-remove="handleRemove" 
                    :on-success="handleSuccess" 
                    :on-preview="handlePictureCardPreview">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>

            <el-form-item label="销售属性">
                <el-select v-model="spuSaleAttrIdName"
                    :placeholder="unUseSpuSaleAttrlist.length > 0 ? `还有${unUseSpuSaleAttrlist.length}条未选择` : '没有啦！！！'">
                    <el-option v-for="( unUse, index) in unUseSpuSaleAttrlist" :key='unUse.id' 
                        :value="`${unUse.id}:${unUse.name}`"  :label="unUse.name">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-plus" @click="addSaleAttr" :disabled="!spuSaleAttrIdName">添加销售属性</el-button>

                <el-table border :data="spuForm.spuSaleAttrList" stripe style="margin: 20px auto;">
                    <el-table-column prop="prop" align="center" type="index" label="序号" width="80">
                    </el-table-column>
                    <el-table-column prop="saleAttrName" label="属性名" width="150">
                    </el-table-column>
                    <el-table-column prop="prop" label="属性值名称列表" width="width">
                        <template slot-scope='{row,$index}'>
                            <el-tag v-for="(spuSaleAttrValue, index) in row.spuSaleAttrValueList"
                                :key='spuSaleAttrValue.id' closable :disable-transitions="false"
                                @close="row.spuSaleAttrValueList.splice(index, 1)">
                                {{ spuSaleAttrValue.saleAttrValueName }}
                            </el-tag>
                            <!-- 本来只是inputVisible，改为row.inputVisible是代表是否是编辑模式，我们这次是把这个值定义在属性身上
                                之前我们的平台属性是把这个值定义在属性值身上
                                因为现在我们每个属性当中所有的属性值都不能有自己的编辑模式和查看模式，而是每个属性有一个
                                之前我们是每个属性值都有自己的编辑模式和查看模式 -->
                            <!-- row.inputValue代表输入input后，输入的数据收集到哪里，我们先把收集的数据保存到当前属性身上
                                后面失去焦点或者回车的时候，再从当前这个属性身上去拿 -->
                            <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue"
                                ref="saveTagInput" placeholder="内容"
                                @keyup.enter.native="handleInputConfirm(row)"
                                @blur="handleInputConfirm(row)" size="small">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(row)"> + 添加</el-button>
                        </template>
                    </el-table-column>

                    <el-table-column prop="prop" label="操作" width="150">
                        <template slot-scope='{row,$index}'>
                            <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除"
                                @click="spuForm.spuSaleAttrList.splice($index, 1)" >
                            </HintButton>
                        </template>
                    </el-table-column>
                </el-table>

                <el-button type="primary" @click="save">保存</el-button>
                
                <el-button @click="cancel">取消</el-button>


            </el-form-item>

        </el-form>
    </div>
</template>

<script>
export default {
    name: 'Spuform',
    // props:['isShowSpuform'], :visible.sync 通信方法传递过来的数据
    data() {
        return {
            spuForm: {
                "category3Id": 0,
                "description": "",   //v-model
                "tmId": '',         //v-model
                "spuName": "",     //v-model
                "spuImageList": [
                    // {
                    //     "id": 0,
                    //     "imgName": "string",
                    //     "imgUrl": "string",
                    //     "spuId": 0
                    // }
                ],
                "spuSaleAttrList": [  //在添加时已经收集
                    // {
                    //     "baseSaleAttrId": 0,
                    //     "id": 0,
                    //     "saleAttrName": "string",
                    //     "spuId": 0,
                    //     "spuSaleAttrValueList": [
                    //         {
                    //             "baseSaleAttrId": 0,
                    //             "id": 0,
                    //             "isChecked": "string",
                    //             "saleAttrName": "string",
                    //             "saleAttrValueName": "string",
                    //             "spuId": 0
                    //         }
                    //     ]
                    // }
                ],
            },
            // 收集属性id和name
            spuSaleAttrIdName: '',

            // 图片上传和放大
            dialogImageUrl: '',
            dialogVisible: false,

            category3Id: '', //获取category3Id
            spuImageList: [], //获取图片列表到时候存在这个里面，最后再把这个图片列表整理完成放到spuForm里面
            
            trademarkList: [], //获取所有的品牌列表存在这里面
            baseSaleAttrList: [], //获取所有的spu销售属性存在这里面
        }
    },
    methods: {
        // 删除图片的成功回调
        handleRemove(file, fileList) {
            // file代表点击的图片，fileList当前剩余展示的图片
            // 删除后保存剩余的图片
            this.spuImageList = fileList
        },
        // 上传新图片成功的回调
        handleSuccess(response, file, fileList) {
            // 上传成功后保存剩余的图片
            // console.log(response, file, fileList);
            this.spuImageList = fileList
        },
        //预览大图
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },

        // 请求获取 修改spu初始化展示数据   函数当中在发那4个请求
        async initUpdateSpuFormDate(spu) {
            // spu就是传递过来的row
            this.category3Id = spu.category3Id
            //1.获取spu的详情
            // http://localhost:9529/dev-api/admin/product/getSpuById/4
            const result = await this.$API.spu.get(spu.id);
            if (result.code === 200) {
                this.spuForm = result.data;
            }
            //2.获取spu的图片列表数据
            //http://localhost:9529/dev-api/admin/product/spuImageList/4
            const imgResult = await this.$API.sku.getSpuImageList(spu.id);
            if (imgResult.code === 200) {
                let spuImageList = imgResult.data;
                //给每个图片对象添加name 和 url,否则照片墙没法展示
                // 在获取到数据，赋值给响应式数据spuImageList，之前，把所有的数据处理好，最后一次性赋值给响应式数据
                // 那么数据对象当中所有的属性都是响应式的
                spuImageList.forEach(item => {
                    item.name = item.imgName
                    item.url = item.imgUrl
                });
                this.spuImageList = spuImageList
            }
            //3.获取所有的品牌列表数据
            //http://localhost:9529/dev-api/admin/product/baseTrademark/getTrademarkList
            const trademarkResult = await this.$API.trademark.getList();
            if (trademarkResult.code === 200) {
                this.trademarkList = trademarkResult.data;
            }
            //4.获取spu所有的销售属性数据
            //http://localhost:9529/dev-api/admin/product/baseSaleAttrList
            const baseSaleAttrResult = await this.$API.spu.getSaleAttrList();
            if (baseSaleAttrResult.code === 200) {
                this.baseSaleAttrList = baseSaleAttrResult.data;
            }
        },

        // 请求获取 获取spu初始化展示数据  //函数当中在发那2个请求 
        async initAddSpuFormDate(category3Id) {
            this.category3Id = category3Id  //接受父组件传递的category3Id
            //1.获取所有的品牌列表数据
            //http://localhost:9529/dev-api/admin/product/baseTrademark/getTrademarkList
            const trademarkResult = await this.$API.trademark.getList();
            if (trademarkResult.code === 200) {
                this.trademarkList = trademarkResult.data;
            }
            //2.获取spu所有的销售属性数据
            //http://localhost:9529/dev-api/admin/product/baseSaleAttrList
            const baseSaleAttrResult = await this.$API.spu.getSaleAttrList();
            if (baseSaleAttrResult.code === 200) {
                this.baseSaleAttrList = baseSaleAttrResult.data;
            }
        },

        // 添加未展示的属性
        addSaleAttr() {
            // {
            //     "baseSaleAttrId": 0,
            //     "saleAttrName": "string",
            //     "spuSaleAttrValueList": []
            // }
            let [baseSaleAttrId, saleAttrName] = this.spuSaleAttrIdName.split(':')
            let obj = {
                baseSaleAttrId,
                saleAttrName,
                spuSaleAttrValueList: []
            }
            this.spuForm.spuSaleAttrList.push(obj)
            // 之后把添加展示的属性从 未使用的属性中除掉
            this.spuSaleAttrIdName = ''
        },

        // 按钮转为input框
        showInput(row) {
            // 设置当前input为响应式数据
            this.$set(row, 'inputVisible', true)
            // 自动获取焦点
            this.$nextTick(() => {
                this.$refs.saveTagInput.focus()
            })
        },
        // input框失去焦点或回车后的回调
        handleInputConfirm(row) {
            // "spuSaleAttrList": [
            //         // {
            //         //     "spuSaleAttrValueList": [
            //         //         {    
            //                        "baseSaleAttrId": 0,
            //         //             "saleAttrValueName": "string",
            //         //         }
            //         //     ]
            //         // }
            //     ],
            // 获取数据
            let baseSaleAttrId = row.baseSaleAttrId
            let saleAttrValueName = row.inputValue
           
            // 判断是否为空
            if (saleAttrValueName.trim() === '') {
                return
            }
            // 判断是否有重复属性
            let repeat = row.spuSaleAttrValueList.some((item) => {
                return item.saleAttrValueName === saleAttrValueName
            })
            if (repeat) {
                this.$message.warning('属性值不能重复')
                row.inputValue = ''
                return
            }

            let obj = {
                saleAttrValueName,
                baseSaleAttrId
            }
            row.spuSaleAttrValueList.push(obj)
            // 把原来input的内容清空
            row.inputValue = ''
            // 再转变为按钮
            row.inputVisible = false
        },

        // 保存数据
        async save() {
            // 获取数据 整理参数 发请求  成功 失败
            //1. 到此spuForm需要收集的参数只剩下spuImageList 和 category3Id
            let { spuForm, spuImageList, category3Id } = this
            // 1)整理图片参数 注意原本图片属性里imgName=name和imgUrl=url对的，
            // 但新添加的图片是name=imgName，而真实的url:response.data
            // {
            //     "imgName": "string",
            //     "imgUrl": "string",
            // }

            spuForm.spuImageList = spuImageList.map((item) => {
                return {
                    imgName: item.name,
                    imgUrl: item.imgUrl || item.response.data
                }
            })

            // 2)整理category3Id
            spuForm.category3Id = category3Id

            // 3)删除添加到rows身上多余属性 inputVisible  inputValue
            spuForm.spuSaleAttrList.forEach((item) => {
                delete item.inputVisible
                delete item.inputValue
            })

            // 3.发请求
            try {
                await this.$API.spu.addUpdate(spuForm)
                // 1.提示
                this.$message.success('保存成功')
                // 2. 关闭添加或修改页，返回到列表
                this.$emit('update:isShowSpuform', false)  //.sync双向数据同步 >
                // 3.父组件重新发请求，获取属性列表
                this.$emit('successBack')
                // 4.清空data中的所有数据，不然当先点击修改再点击添加后，上一次的数据会停留在页面
                this.resetDate()
            } catch (error) {
                this.$message.error('保存失败')
            }
        },

        // 清空data里的数据
        resetDate() {
            this.spuForm = {
                category3Id : 0,
                description :'',
                tmId :'',
                spuName :'',
                spuImageList:[],
                spuSaleAttrList :[],
            },
                this.spuSaleAttrIdName = ''
                this.dialogImageUrl = ''
                this.dialogVisible = false
                this.category3Id = ''
                this.spuImageList = []
                this.trademarkList = []
                this.baseSaleAttrList = []
        },

        // 取消
        cancel(){
            // 1.回到列表页
             this.$emit('update:isShowSpuform', false)
            // 2. 通知父组件清掉flag标识
            this.$emit('cancelBack')
            // 3.清空data数据
            this.resetDate()
        }

    },
    computed: {
        // 计算未展示剩余的销售属性
        unUseSpuSaleAttrlist() {
            // 从所有属性列表中过滤
            return this.baseSaleAttrList.filter((baseSaleAttr) => {
                return this.spuForm.spuSaleAttrList.every((spuSaleAttr) => {
                    return baseSaleAttr.name !== spuSaleAttr.saleAttrName
                })
            })
        }
    }
}
</script>

<style>
.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>