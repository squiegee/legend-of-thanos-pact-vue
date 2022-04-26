<template>
  <div>
    <header>
      <!--      Display Navbar section-->
      <Navbar />
    </header>
        <main>
          <transition name="fade" mode="out-in">
            <!--            Display current page the user is routed to-->
            <router-view />
          </transition>
        </main>
  </div>
</template>

<script>
//Load our navbar
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar,
  },
}
</script>

<!--Css styles scoped to the entire application-->
<style>
html{
  overflow-y: hidden !important;
  background-color: #0c0c0c !important;
}

.ontop{
  z-index:2;
}

.moveup {
  position: absolute;
  width: 100%;
  top: 72px;
}

.greenish{
  color: #87ba74 !important;
}

.body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: black;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}


</style>
