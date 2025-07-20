import React from "react";

const About = () => {
const styles = {
  page: {
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#fff",
    color: "#222",
    padding: "0",
    margin: "0",
  },
  section: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "80px 20px",
  },
  header: {
    fontSize: "42px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "20px",
    color: "#111",
  },
  subHeader: {
    textAlign: "center",
    fontSize: "18px",
    color: "#666",
    marginBottom: "60px",
    maxWidth: "600px",
    marginInline: "auto",
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    gap: "40px",
    alignItems: "center",
    justifyContent: "space-between",
  },
  columnText: {
    flex: "1 1 500px",
    fontSize: "16px",
    color: "#444",
    lineHeight: "1.7",
  },
  columnImage: {
    flex: "1 1 400px",
  },
  image: {
    width: "100%",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    objectFit: "cover",
  },
  highlight: {
    backgroundColor: "#f3f3f3",
    padding: "40px 30px",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "500",
    textAlign: "center",
    color: "#000",
    margin: "60px 0",
  },
  stats: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "space-between",
    marginTop: "40px",
  },
  statCard: {
    flex: "1 1 250px",
    backgroundColor: "#fafafa",
    padding: "30px 20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
  },
  statNumber: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#e29521", // 🔶 changed from #e91e63
  },
  statLabel: {
    fontSize: "14px",
    color: "#666",
    marginTop: "8px",
  },
  testimonials: {
    marginTop: "80px",
  },
  testimonialCard: {
    backgroundColor: "#fdfdfd",
    borderLeft: "5px solid #e29521", // 🔶 changed from #e91e63
    padding: "30px",
    marginBottom: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
  },
  testimonialText: {
    fontStyle: "italic",
    color: "#444",
  },
  testimonialAuthor: {
    marginTop: "12px",
    fontWeight: "bold",
    color: "#000",
  },
  footer: {
    marginTop: "80px",
    padding: "30px 20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#aaa",
    borderTop: "1px solid #eee",
  },
};


  return (
    <div style={styles.page}>
      <div style={styles.section}>
       <h1
  style={{
    fontSize: "40px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "30px",
    background: "linear-gradient(90deg, #f5f7fa 0%,rgb(159, 167, 179) 100%)",
    color: "#333",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
    letterSpacing: "1px",
    textTransform: "uppercase",
    fontFamily: "'Segoe UI', sans-serif"
  }}
>
  ABOUT Meals On Wheels
</h1>

        <p style={styles.subHeader}>
          Bridging your cravings and the best food near you — fast, fresh, and
          reliable.
        </p>

        {/* Main Content */}
        <div style={styles.row}>
          <div style={styles.columnText}>
            <p>
              <strong>Meals On Wheels</strong> is the easiest way to discover and
              enjoy food around you. Whether you're looking for quick delivery,
              gourmet meals, or your favorite local joints — we’re here to help
              you eat better every day.
            </p>
            <p>
              We partner with top restaurants and offer real-time tracking,
              seamless ordering, and a satisfaction guarantee. Our mission is to
              simplify food delivery while elevating your experience with every
              meal.
            </p>
          </div>
          <div style={styles.columnImage}>
            <img
              src="https://media.istockphoto.com/id/1446478827/photo/a-chef-is-cooking-in-his-restaurants-kitchen.jpg?s=612x612&w=0&k=20&c=jwKJmGErrLe2XsTWNYEEyiNicudYVA4j8jvnTiJdp58="
              alt="Delicious food"
              style={styles.image}
            />
          </div>
        </div>

        {/* Highlight Section */}
        <div style={styles.highlight}>
          “We deliver not just meals, but comfort, quality, and satisfaction.”
        </div>

        {/* Statistics */}
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>12K+</div>
            <div style={styles.statLabel}>Orders Delivered</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>1.8K+</div>
            <div style={styles.statLabel}>Restaurants Partnered</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>98.7%</div>
            <div style={styles.statLabel}>Customer Satisfaction</div>
          </div>
        </div>

        {/* Testimonials */}
        <div style={styles.testimonials}>
          <h2 style={{ ...styles.header, fontSize: "28px", marginBottom: "40px" }}>
            What Our Customers Say
          </h2>

          <div style={styles.testimonialCard}>
            <p style={styles.testimonialText}>
              "Fast delivery, beautiful app, and super friendly support. I order
              every week from Meals On Wheels!"
            </p>
            <div style={styles.testimonialAuthor}>– Sarah J.</div>
          </div>



          <div style={styles.testimonialCard}>
            <p style={styles.testimonialText}>
              "Meals On Wheels completely changed how I eat. It’s so easy and smooth,
              and the meals are always hot!"
            </p>
            <div style={styles.testimonialAuthor}>– Mike T.</div>
          </div>

          <div style={styles.testimonialCard}>
            <p style={styles.testimonialText}>
              "Fast delivery! It’s so easy and smooth and super friendly support."
            </p>
            <div style={styles.testimonialAuthor}>– Nimra.</div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default About;
