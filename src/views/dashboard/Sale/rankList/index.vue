<template>
  <div>
    <h3>门店{{ title }}排名</h3>
    <ul>
      <li>
        <span class="rindex">1</span>
        <span>麦当劳</span>
        <span class="value">323,234</span>
      </li>
      <li>
        <span class="rindex">2</span>
        <span>肯德基</span>
        <span class="value">323,234</span>
      </li>
      <li>
        <span class="rindex">3</span>
        <span>德克士</span>
        <span class="value">323,234</span>
      </li>
      <li>
        <span class="rindex index">4</span>
        <span>肯德基</span>
        <span class="value">323,234</span>
      </li>
      <li>
        <span class="rindex index">5</span>
        <span>肯德基</span>
        <span class="value">323,234</span>
      </li>
      <li>
        <span class="rindex index">6</span>
        <span>肯德基</span>
        <span class="value">323,234</span>
      </li>
      <li>
        <span class="rindex index">7</span>
        <span>肯德基</span>
        <span class="value">323,234</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "rankList",
  props: ["title"],
};
</script>

<style scoped>
h3 {
  margin: 0;
}
ul {
  list-style: none;
  width: 100%;
  padding: 0;
  margin-bottom: 0;
}
ul li {
  height: 30px;
  margin: 10px 0;
}
.rindex {
  display: inline-block;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: #333;
  color: #fff;
  text-align: center;
  margin-right: 15px;
}
.index {
  background-color: #fff;
  color: #333;
}
.value {
  float: right;
}
</style>