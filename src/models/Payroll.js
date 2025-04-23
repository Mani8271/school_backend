const mongoose = require("mongoose");

const PayrollSchema = new mongoose.Schema({
    
    employeeName: { 
        type: String, 
        
    },
    netSalary: { 
        type: String, 
        
    },
    month: { 
        type: String, 
        
    },
    year: { 
        type: String, 
        
    },
    basic: { 
        type: String, 
        
    },
    tds: { 
        type: String, 
        
    },
    da: { 
        type: String, 
        
    },
    esi: { 
        type: String, 
        
    },
    hra: { 
        type: String, 
        
    },
    pf: { 
        type: String, 
        
    },
    conveyance: { 
        type: String, 
        
    },
    leaves: { 
        type: String, 
        
    },
    allowance: { 
        type: String, 
        
    },
    profTax: { 
        type: String, 
        
    },
    medicalAllowance: { 
        type: String, 
        
    }
}
,
{
  timestamps:true
});

module.exports = mongoose.model("Payroll", PayrollSchema);
